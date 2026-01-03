import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseDocument } from './entities/document.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User } from '../user/entities/user.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(CaseDocument)
    private documentRepository: Repository<CaseDocument>,
    private cloudinaryService: CloudinaryService,

  ) {}

  async uploadDocument(
    file: Express.Multer.File,
    uploadDocumentDto: CreateDocumentDto,
    currentUser: User
  ): Promise<CaseDocument> {
    const uploadResult = await this.cloudinaryService.uploadFile(file, "legad-documents")

    const document = this.documentRepository.create({
      caseId: uploadDocumentDto.caseId,
      uploadedBy: currentUser.id,
      fileName: file.originalname,
      filePath: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType: file.mimetype,
      fileSize: file.size,
      description: uploadDocumentDto.description
    })

    const saved = await this.documentRepository.save(document);

    return saved;
  }

  async findByCaseId (caseId: number) { 
    return this.documentRepository.find({
      where: {caseId},
      relations: ['uploader'],
      order: {createdAt: "DESC"}
    })
  }
}
