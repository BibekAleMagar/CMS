import { z } from "zod";
import { createCaseSchema } from "../validators/case";
import { CaseStatus } from "./enums/case-status.enum";
import { CaseDocumentResponse } from "./document";
import { updateCaseSchema } from "../validators/case";
import { User } from "./User";
export type GetCaseDto = {
  id: number;
  caseNumber: string;
  description: string | null;
  title: string;
  status: CaseStatus;
  lawyerId: number | null;
  clientId: number;
  court: string;
  filingDate: string | null;
  nextHearing: string | null;
  createdAt: string;
  updatedAt: string;
  documents: CaseDocumentResponse[];
  client: User;
  lawyer: User | null;
};

export type CreateCaseDto = z.infer<typeof createCaseSchema>;
export type UpdateCaseDto = z.infer<typeof updateCaseSchema>;
