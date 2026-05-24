import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Task title must be at least 2 characters'),
    description: z.string().optional(),
    estimateHours: z.number().nonnegative().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    sprintId: z.string().cuid().optional(),
    parentTaskId: z.string().cuid().optional(),
    assigneeIds: z.array(z.string().cuid()).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    status: z.nativeEnum(TaskStatus).optional(),
  }),
});
