import { z } from "zod";
import { CaseStatus } from "../types/enums/case-status.enum";

export const createCaseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  lawyerId: z.coerce.number().optional(),
  court: z.string().optional(),
});

export const updateCaseSchema = z.object({
  lawyerId: z.coerce
    .number({
      invalid_type_error: "Lawyer ID must be a number",
    })
    .int("Lawyer ID must be an integer")
    .positive("Lawyer ID must be a positive number")
    .optional(),

  title: z
    .string({
      invalid_type_error: "Title must be a string",
    })
    .min(1, "Title must not be empty")
    .max(255, "Title must not exceed 255 characters")
    .optional(),

  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  status: z
    .nativeEnum(CaseStatus, {
      errorMap: () => ({ message: "Invalid case status" }),
    })
    .optional(),

  court: z
    .string({
      invalid_type_error: "Court must be a string",
    })
    .max(255, "Court name must not exceed 255 characters")
    .optional(),

  filingDate: z
    .union([
      z.string().datetime(),
      z.date(),
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    ])
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  nextHearingDate: z
    .union([
      z.string().datetime(),
      z.date(),
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    ])
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});
