import { emitWarning } from 'process'
import {z} from 'zod'
import { UserRole } from '../types/enums/user-role.enum'

export const registerSchema = z.object({
    email: z.string().min(1,"Email is required").email(),
    password: z.string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.nativeEnum(UserRole),
    avatar: z.instanceof(File).optional(),
    phoneNumber: z.string()

  

})