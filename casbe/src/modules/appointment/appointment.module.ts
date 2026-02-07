import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from '../case/entities/case.entity';
import { Appointment } from './entities/appointment.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Case])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
