import { registerSchema } from "../validators/register";
import {z} from "zod";


export type RegisterType = z.infer<typeof registerSchema>