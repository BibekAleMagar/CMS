import { User } from "./User";

export type LawyerProfile = {
  id: number;
  specializations: string[];
  experience: number;
  successRate: number;
  active: boolean;
};

export type Lawyer = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "LAWYER" | "ADMIN" | "USER";
  phone: string;
  avatar: string;
  lawyerProfile: LawyerProfile | null;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  client: User;
  lawyer: User | null;
};
