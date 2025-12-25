import {z} from 'zod';
import { createCaseSchema } from '../validators/case';
import { CaseStatus } from './enums/case-status.enum';
export type GetCaseDto = {
    id: number;
  caseNumber: string;
  title: string;
  status: CaseStatus; // adjust based on backend enum
  lawyerId: number | null;
  clientId: number;
  court: string;
  filingDate: string | null;     // ISO date string or null
  nextHearing: string | null;    // ISO date string or null
  createdAt: string;             // ISO date string
  updatedAt: string;         
}

export type CreateCaseDto = z.infer<typeof createCaseSchema>