import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './entities/case.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CaseStatus } from 'src/common/enums/case-status.enum';
import { AiAnalysisResult } from '../../common/types/AiResult';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, timeout } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CaseType } from 'src/common/enums/case-type.enum';

@Injectable()
export class CaseService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async create(createCaseDto: CreateCaseDto, user: User): Promise<Case> {
    const caseNumber = await this.generateCaseNumber();

    const newCase = this.caseRepository.create({
      title: createCaseDto.title,
      court: createCaseDto.court,
      status: createCaseDto.status ?? CaseStatus.PENDING,
      caseNumber,
    });

    if (user.role === UserRole.CLIENT) newCase.clientId = user.id;
    if (user.role === UserRole.LAWYER) newCase.lawyerId = user.id;

    return this.caseRepository.save(newCase);
  }

  async findAll(user: User): Promise<Case[]> {
    let query = this.caseRepository
      .createQueryBuilder('case')
      .leftJoinAndSelect('case.lawyer', 'lawyer')
      .leftJoinAndSelect('case.client', 'client');

    if (user.role === UserRole.LAWYER) {
      query = query.where('case.lawyerId = :userId', { userId: user.id });
    }
    if (user.role === UserRole.CLIENT) {
      query = query.where('case.clientId = :userId', { userId: user.id });
    }
    if (user.role === UserRole.SUPER_ADMIN) {
      query = query.orderBy('case.createdAt', 'DESC');
    }
    return query.getMany();
  }

  async chartStats() {
  const [byStatus, byType, byMonth] = await Promise.all([
    this.caseRepository
      .createQueryBuilder('case')
      .select('case.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('case.status')
      .getRawMany(),

    this.caseRepository
      .createQueryBuilder('case')
      .select('case.caseType', 'caseType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('case.caseType')
      .getRawMany(),

    this.caseRepository
      .createQueryBuilder('case')
      .select("DATE_FORMAT(case.createdAt, '%Y-%m')", 'month') // MySQL
      // .select("strftime('%Y-%m', case.createdAt)", 'month')  // SQLite
      // .select("TO_CHAR(case.createdAt, 'YYYY-MM')", 'month') // PostgreSQL
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany(),
  ]);

  return {
    byStatus: byStatus.map((s) => ({ ...s, count: Number(s.count) })),
    byType: byType.map((t) => ({ ...t, count: Number(t.count) })),
    byMonth: byMonth.map((m) => ({ ...m, count: Number(m.count) })),
  };
}

  async dashboardStats(): Promise<{
    totalCases: number;
    totalClients: number;
    totalLawyers: number;
    totalUsers: number;
  }> {    
    const [totalCases, totalClients, totalLawyers, totalUsers] = await Promise.all([
      this.caseRepository.count(),
      this.userRepository.count({ where: { role: UserRole.CLIENT } }),
      this.userRepository.count({ where: { role: UserRole.LAWYER } }),
      this.userRepository.count(),
    ]);

    return {
      totalCases,
      totalClients,
      totalLawyers,
      totalUsers,
    };
  }

  async findOne(id: number, user: User): Promise<Case> {
    try {
      const caseEntity = await this.caseRepository.findOne({
        where: { id },
        relations: [
          'lawyer',
          'client',
          'appointments',
          'documents',
          'activityLogs',
        ],
      });

      if (!caseEntity) throw new NotFoundException('Case not found');

      this.checkAccess(caseEntity, user);

      return caseEntity;
    } catch (err) {
      console.error('Error fetching case:', err);

      if (
        err instanceof NotFoundException ||
        err instanceof ForbiddenException
      ) {
        throw err;
      }

      throw new InternalServerErrorException('Failed to fetch case');
    }
  }

  async update(
    id: number,
    updateCaseDto: UpdateCaseDto,
    currentUser: User,
  ): Promise<Case> {
    const caseEntity = await this.findOne(id, currentUser);

    if (updateCaseDto?.status && currentUser?.role === UserRole?.CLIENT) {
      throw new ForbiddenException('Client cannot update status');
    }

    if (updateCaseDto.status) {
      caseEntity.status = updateCaseDto.status;
    }

    if (updateCaseDto.lawyerId) {
      const lawyer = await this.userRepository.findOne({
        where: { id: updateCaseDto.lawyerId },
      });

      if (!lawyer) {
        throw new NotFoundException('Lawyer not found');
      }
      if (lawyer.role !== UserRole.LAWYER) {
        throw new ForbiddenException('User is not a lawyer');
      }
      caseEntity.lawyerId = lawyer.id;
    }

    if (updateCaseDto.nextHearingDate) {
      caseEntity.nextHearing = updateCaseDto.nextHearingDate;
    }

    return this.caseRepository.save(caseEntity);
  }

  async remove(id: number, currentUser: User): Promise<void> {
    const caseEntity = await this.findOne(id, currentUser);

    if (currentUser.role !== UserRole.SUPER_ADMIN)
      throw new ForbiddenException('Only admins can delete cases');

    await this.caseRepository.remove(caseEntity);
  }

  async getRecommendedLawyers(caseId: number): Promise<{
    predictedCategory: string | null;
    confidence: number | null;
    top3: Record<string, number> | null;
    lawyers: User[];
  }> {
    const caseEntity = await this.caseRepository.findOne({
      where: { id: caseId },
    });
    if (!caseEntity) throw new NotFoundException('Case not found');

    const aiResult = await this.callAi(caseEntity);
    console.log('AI Result:', aiResult);

    if (!aiResult.suggestedSpecialty) {
      throw new InternalServerErrorException(
        'Failed to fetch recommended lawyers',
      );
    }

    const caseType = this.mapAiCategoryToCaseType(aiResult.suggestedSpecialty);
    console.log('Mapped caseType:', caseType);

    if (!caseType) {
      throw new InternalServerErrorException(
        'Failed to fetch recommended lawyers',
      );
    }

    const lawyers = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.lawyerProfile', 'lawyerProfile')
  .where('user.role = :role', { role: UserRole.LAWYER })
  .andWhere('lawyerProfile.specializations LIKE :caseType', { 
    caseType: `%${caseType}%` 
  })
  .getMany();

    return {
      predictedCategory: aiResult.suggestedSpecialty,
      confidence: aiResult.confidence,
      top3: aiResult.top3,
      lawyers,
    };
  }

  private async generateCaseNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.caseRepository.count();
    return `CASE-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async callAi(caseEntity: Case): Promise<AiAnalysisResult> {
    try {
      const baseUrl = this.configService.get<string>('AI_MODEL');
      const payload = {
        case_name: caseEntity?.title,
        nature_of_suit: caseEntity.caseType,
        summary: caseEntity.description ?? caseEntity.title, // ✅ fallback for null
      };

      console.log('Calling AI with payload:', payload);
      console.log('AI URL:', baseUrl);

      const response = await lastValueFrom(
        this.httpService.post(`${baseUrl}`, payload).pipe(timeout(5000)),
      );

      console.log('Raw AI response:', response?.data);

      return {
        suggestedSpecialty: response?.data?.predicted_category ?? null, // ✅ fixed key
        confidence: response?.data?.confidence ?? null,
        top3: response?.data?.top_3 ?? null, // ✅ fixed key
      };
    } catch (error) {
      console.log('AI call error:', error.response);
      return { suggestedSpecialty: null, confidence: null, top3: null };
    }
  }

  private mapAiCategoryToCaseType(category: string | null): CaseType | null {
    if (!category) return null;

    const map: Record<string, CaseType> = {
      Civil_Litigation: CaseType.CIVIL,
      Property_Estate: CaseType.PROPERTY,
      Corporate_Contract: CaseType.CORPORATE,
      Criminal: CaseType.CRIMINAL,
      Family: CaseType.FAMILY,
      Labour: CaseType.LABOUR,
    };

    return map[category] ?? null;
  }

  private checkAccess(caseEntity: Case, user: User) {
    if (user?.role === UserRole.SUPER_ADMIN) return;

    const clientId = caseEntity?.clientId ?? caseEntity?.client?.id;
    const lawyerId = caseEntity?.lawyerId ?? caseEntity?.lawyer?.id;

    if (
      (user?.role === UserRole.CLIENT && clientId !== user?.id) ||
      (user?.role === UserRole.LAWYER && lawyerId !== user?.id)
    ) {
      throw new ForbiddenException('Access denied');
    }
  }
}