import { loginSchema } from "../validators/Login";
import {z} from "zod";

export type LoginType = z.infer<typeof loginSchema>;