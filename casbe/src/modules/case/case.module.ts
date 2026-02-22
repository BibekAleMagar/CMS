import { Module } from '@nestjs/common';
import { CaseService } from './case.service';
import { CaseController } from './case.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from './entities/case.entity';
import { User } from '../user/entities/user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Case, User]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [CaseController],
  providers: [CaseService],
})
export class CaseModule {}
