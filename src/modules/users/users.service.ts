import prisma from '../../config/prisma';
import { UserRole } from '@prisma/client';

export const updateProfile = async (
  userId: string,
  data: { name?: string; department?: string; avatar?: string },
) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      role: true,
      avatar: true,
    },
  });
};

export const getTeamDirectory = async (filters: {
  department?: string;
  role?: UserRole;
}) => {
  return await prisma.user.findMany({
    where: {
      department: filters.department || undefined,
      role: filters.role || undefined,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      avatar: true,
      isActive: true,
    },
  });
};
