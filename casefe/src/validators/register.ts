import { z } from "zod";
import { UserRole } from "../types/enums/user-role.enum";

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.nativeEnum(UserRole),
    avatar: z.instanceof(File).optional(),
    phoneNumber: z.string(),
    specializations: z.array(z.string().min(1)).optional(),
    experience: z.coerce.number().int().min(0).optional(),
    successRate: z.number().min(0).max(100).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === UserRole.LAWYER) {
      if (!data?.specializations || data.specializations.length === 0) {
        ctx.addIssue({
          path: ["specializations"],
          message: "Specializations are required for lawyers",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.experience === undefined) {
        ctx.addIssue({
          path: ["experience"],
          message: "Experience is required for lawyers",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
