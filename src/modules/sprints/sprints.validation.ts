import { z } from 'zod';

export const createSprintSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Sprint title must be at least 2 characters'),
    startDate: z
      .string()
      .datetime({ message: 'Invalid ISO start date string' }),
    endDate: z.string().datetime({ message: 'Invalid ISO end date string' }),
    order: z.number().int().nonnegative().optional(),
  }),
});

export const updateSprintSchema = z.object({
  body: createSprintSchema.shape.body.partial(),
});
