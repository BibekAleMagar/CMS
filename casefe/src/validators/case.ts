import {z} from 'zod'


export const createCaseSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().optional(),
    lawyerId: z.coerce.number().optional(),
    court: z.string().optional()
})