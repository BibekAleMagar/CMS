export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "CLIENT" | "LAWYER" | "SUPER_ADMIN";
  phone: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}