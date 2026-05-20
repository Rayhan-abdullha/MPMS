import { UserRole } from '@prisma/client';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  department?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}
