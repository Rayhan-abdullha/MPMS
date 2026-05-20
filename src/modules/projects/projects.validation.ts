import { z } from 'zod';
import { ProjectStatus } from '@prisma/client';
export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    client: z.string().min(2, 'Client name is required'),
    description: z.string().optional(),
    startDate: z.string().datetime({ message: 'Invalid ISO date string' }),
    endDate: z.string().datetime().optional(),
    budget: z.number().nonnegative().optional(),
    thumbnail: z.string().url().optional().or(z.literal('')),
    status: z.nativeEnum(ProjectStatus).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: createProjectSchema.shape.body.partial(),
});
