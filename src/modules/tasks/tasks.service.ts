import prisma from '../../config/prisma';
import { TaskStatus, ActivityType } from '@prisma/client';
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
} from './tasks.types';

export const createTask = async (
  projectId: string,
  userId: string,
  data: CreateTaskInput,
) => {
  const { assigneeIds, dueDate, ...taskData } = data;

  // Verify Project Existence
  const projectExists = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!projectExists) {
    const error = new Error('Project not found');
    (error as any).statusCode = 404;
    throw error;
  }

  // Use a transaction to create the task, assign members, and build logs safely
  return await prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        ...taskData,
        projectId,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignees:
          assigneeIds && assigneeIds.length > 0
            ? {
                create: assigneeIds.map((id) => ({ userId: id })),
              }
            : undefined,
      },
      include: {
        assignees: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    // Fire off internal activity logging lifecycle event
    await tx.activityLog.create({
      data: {
        type: ActivityType.TASK_CREATED,
        description: `Task "${task.title}" was successfully launched.`,
        taskId: task.id,
        userId,
      },
    });

    return task;
  });
};

export const getTasksByProject = async (
  projectId: string,
  filters: TaskQueryParams,
) => {
  const { status, priority, sprintId, search } = filters;

  const whereClause: any = { projectId };
  if (status) whereClause.status = status;
  if (priority) whereClause.priority = priority;
  if (sprintId) whereClause.sprintId = sprintId;
  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return await prisma.task.findMany({
    where: whereClause,
    include: {
      assignees: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
      subTasks: true,
      _count: { select: { comments: true, attachments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: UpdateTaskInput,
) => {
  const { assigneeIds, dueDate, ...updateData } = data;

  const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existingTask) {
    const error = new Error('Task not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return await prisma.$transaction(async (tx) => {
    // If explicit assignee mappings are attached, drop historical states and overwrite cleanly
    if (assigneeIds !== undefined) {
      await tx.taskAssignee.deleteMany({ where: { taskId } });
    }

    const updatedTask = await tx.task.update({
      where: { id: taskId },
      data: {
        ...updateData,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignees:
          assigneeIds && assigneeIds.length > 0
            ? {
                create: assigneeIds.map((id) => ({ userId: id })),
              }
            : undefined,
      },
    });

    // Handle activity tracking if status values changed
    if (data.status && data.status !== existingTask.status) {
      await tx.activityLog.create({
        data: {
          type: ActivityType.TASK_STATUS_CHANGED,
          description: `Status evolved from ${existingTask.status} -> ${data.status}`,
          taskId,
          userId,
        },
      });
    }

    return updatedTask;
  });
};

export const deleteTask = async (taskId: string) => {
  const existingTask = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existingTask) {
    const error = new Error('Task not found');
    (error as any).statusCode = 404;
    throw error;
  }

  await prisma.task.delete({ where: { id: taskId } });
};
