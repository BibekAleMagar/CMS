import { z } from 'zod';

export const createCaseDocumentSchema = z.object({
 caseId: z.coerce.number(),
 description: z.string().max(200).optional(),
 file: z.instanceof(File)
});
