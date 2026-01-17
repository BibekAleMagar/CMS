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

@Injectable()
export class CaseService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    return query.getMany();
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
    return this.caseRepository.save(caseEntity);
  }

  async remove(id: number, currentUser: User): Promise<void> {
    const caseEntity = await this.findOne(id, currentUser);

    if (currentUser.role !== UserRole.SUPER_ADMIN)
      throw new ForbiddenException('Only admins can delete cases');

    await this.caseRepository.remove(caseEntity);
  }

  private async generateCaseNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.caseRepository.count();
    return `CASE-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  private checkAccess(caseEntity: Case, user: User) {
    if (user?.role === UserRole.SUPER_ADMIN) return;

    // Safe optional chaining
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
