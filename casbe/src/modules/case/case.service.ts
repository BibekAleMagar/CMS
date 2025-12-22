import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './entities/case.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { v2 as cloudinary } from 'cloudinary';
import { error } from 'console';



@Injectable()
export class CaseService {
 constructor(
  @InjectRepository(Case)
  private caseRepository: Repository<Case>,
  @InjectRepository(User)
  private userRepository: Repository<User>
 ) {}

async create(createCaseDto: CreateCaseDto, updateCaseDto: UpdateCaseDto): Promise<Case> {
  const caseNumber= await this.generateCaseNumber();

  const newCase = this.caseRepository.create({
    ...createCaseDto,
    caseNumber,

  })

  const savedCase = await this.caseRepository.save(newCase);

  return this.findOne(savedCase.id)
  
}

async findAll (user: User) : Promise<Case[]> {
  let query = this.caseRepository
  .createQueryBuilder('cases')
  .leftJoinAndSelect('case.lawyer', 'lawyer')
  .leftJoinAndSelect('case.client', 'client')

  if(user.role === UserRole.LAWYER) {
    query = query.where('case.lawyerId = :userId', {userId: user.id})
  }
  if(user.role === UserRole.CLIENT) {
    query = query.where('case.clientId = :userId', {userId: user.id})
  }
  return query.getMany()
}


async findOne(id: number): Promise<Case> {
  const caseEntity = await this.caseRepository.findOne({
    where: {id},
    relations: ["lawyer","clients", "documents", "appointments"]
  })

  if(!caseEntity) throw new NotFoundException("Case not found")

  return caseEntity;
}

async remove(id:number, currentUser: User): Promise<void> {
  const caseEntity = await this.findOne(id)
  if (currentUser.role !== "SUPER_ADMIN") throw new ForbiddenException("Oly admins can delete cases");
  await this.caseRepository.remove(caseEntity)
}

private async generateCaseNumber(): Promise<string> {
   const year = new Date().getFullYear();
    const count = await this.caseRepository.count();
    return `CASE-${year}-${String(count + 1).padStart(5, '0')}`;
}

private checkAccess(caseEntity: Case, user:User) {
  if(user.role === UserRole.SUPER_ADMIN) return ;
  if(
    user.role === UserRole.CLIENT && caseEntity.clientId !== user.id || 
    user.role === UserRole.LAWYER && caseEntity.lawyerId !== user.id
  ) {
    throw new ForbiddenException("access denied")
  }
}
}
