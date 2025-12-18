import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { UserModule } from './modules/user/user.module';
import { UserController } from './modules/user/user.controller';
import { DocumentsModule } from './modules/documents/documents.module';
import { CaseModule } from './modules/case/case.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ActivityModule } from './modules/activity/activity.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import entities from './common/typeorm/index';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'kendrix',
    password: 'kendrix',
    database: 'CMS',
    entities: entities,
    synchronize: true,
    logging: true,
  }), UserModule, DocumentsModule, CaseModule, AppointmentModule, ActivityModule, CloudinaryModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
