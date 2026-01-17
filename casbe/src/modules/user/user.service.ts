import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllLawyer(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: UserRole.LAWYER },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'phone',
        'avatar',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
      relations: ['lawyerProfile'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'phone',
        'avatar',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.LAWYER) {
      const lawyerWithProfile = await this.userRepository.findOne({
        where: { id },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'role',
          'phone',
          'avatar',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
        relations: ['lawyerProfile'],
      });

      if (!lawyerWithProfile) {
        throw new NotFoundException('Lawyer not found');
      }

      return lawyerWithProfile;
    }

    return user;
  }
}
