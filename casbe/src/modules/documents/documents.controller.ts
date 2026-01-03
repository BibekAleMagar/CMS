import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from '../user/entities/user.entity';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @Roles(UserRole.LAWYER, UserRole.CLIENT)
  @UseInterceptors(FileInterceptor("file"))
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 10 * 1024 * 1024}),
          new FileTypeValidator({fileType: /(pdf|doc|docx|jpg|jpeg|png)$/,})
        ]
      })
    )
    file: Express.Multer.File,
    @Body() uploadDocumentDto: CreateDocumentDto,
    @CurrentUser() user: User
  ) {
    return this.documentsService.uploadDocument(file, uploadDocumentDto, user)
  }

}
