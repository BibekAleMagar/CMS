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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: `.env.${process.env.NODE_ENV || 'development'}`}),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
      inject: [ConfigService]
    }),
    UserModule, DocumentsModule, CaseModule, AppointmentModule, ActivityModule, CloudinaryModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
