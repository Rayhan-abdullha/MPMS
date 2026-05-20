import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import env from '../../config/env';
import {
  RegisterInput,
  LoginInput,
  AuthResponse,
  UserWithoutPassword,
} from './auth.types';

export const registerUser = async (
  data: RegisterInput,
): Promise<UserWithoutPassword> => {
  const { name, email, password, role, department } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error('Email already registered');
    (error as any).statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'MEMBER',
      department,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
    },
  });

  return user;
};

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('Invalid email or password');
    (error as any).statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Account has been deactivated');
    (error as any).statusCode = 403;
    throw error;
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.access_token_secret, // Make sure this matches your environment key configuration!
    { expiresIn: '1d' },
  );

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
