import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findAll(user: User): Promise<Appointment[]> {
    const query = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'client')
      .leftJoinAndSelect('appointment.case', 'case')
      .leftJoinAndSelect('case.lawyer', 'lawyer');

    if (user.role === UserRole.CLIENT) {
      query.where('client.id = :userId', { userId: user.id });
    } else if (user.role === UserRole.LAWYER) {
      query.where('lawyer.id = :userId', { userId: user.id });
    }
    return query.getMany();
  }
}
