
import {z} from 'zod'
import { User } from './User';
import { createCaseDocumentSchema } from '../validators/document';

export interface CaseDocumentResponse {
  id: number;
  caseId: number;
  fileName: string;
  filePath: string;
  uploadedBy: number;
  publicId: string;
  fileType: string;
  fileSize: number;
  description: string | null;
  createdAt: Date;
  uploader?: User;
}


export type CreateDocumentDto = z.infer<typeof createCaseDocumentSchema>