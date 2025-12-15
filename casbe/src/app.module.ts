import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { UserModule } from './modules/user/user.module';
import { UserController } from './modules/user/user.controller';
import { DocumentsModule } from './modules/documents/documents.module';
import { CaseModule } from './modules/case/case.module';
import entities from './common/typeorm/indes';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'kendrix',
    password: 'kendrix',
    database: 'CMS',
    entities: entities,
    synchronize: true
  }), UserModule, DocumentsModule, CaseModule],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
