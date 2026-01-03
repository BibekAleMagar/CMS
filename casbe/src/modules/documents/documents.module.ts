import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseDocument } from './entities/document.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaseDocument]), CloudinaryModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, CloudinaryService],
  exports: [CloudinaryService]
})
export class DocumentsModule {}
