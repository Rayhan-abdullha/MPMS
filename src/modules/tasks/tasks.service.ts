import prisma from '../../config/prisma';
import { ActivityType, TaskPriority } from '@prisma/client';
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
} from './tasks.types';

export const createTask = async (
  sprintId: string,
  userId: string, // creator (ADMIN / MANAGER)
  data: {
    title: string;
    description?: string;
    estimateHours?: number;
    dueDate?: string;
    priority?: TaskPriority;
    assignedIds?: string[];
    projectId: string;
    parentTaskId?: string;
  },
) => {
  const { assignedIds, projectId, dueDate, parentTaskId, ...taskData } = data;

  // 1. Check sprint exists
  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
  });

  if (!sprint) {
    const error = new Error('Sprint not found');
    (error as any).statusCode = 404;
    throw error;
  }

  // 2. Validate sprint belongs to project
  if (sprint.projectId !== projectId) {
    const error = new Error('Sprint does not belong to this project');
    (error as any).statusCode = 400;
    throw error;
  }

  // 3. Validate parent task
  if (parentTaskId) {
    const parentTask = await prisma.task.findUnique({
      where: { id: parentTaskId },
    });

    if (!parentTask) {
      const error = new Error('Parent task not found');
      (error as any).statusCode = 404;
      throw error;
    }
  }

  // 4. Validate assignees
  if (assignedIds?.length) {
    const users = await prisma.user.findMany({
      where: { id: { in: assignedIds } },
      select: { id: true },
    });

    if (users.length !== assignedIds.length) {
      const error = new Error('Some assignees are invalid');
      (error as any).statusCode = 400;
      throw error;
    }
  }

  // 5. Create task transaction
  return await prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        ...taskData,
        projectId,
        sprintId,
        parentTaskId: parentTaskId || null,
        dueDate: dueDate ? new Date(dueDate) : null,

        // Default status from schema
        status: 'TODO',

        // Assign users
        assignees: assignedIds?.length
          ? {
              create: assignedIds.map((id) => ({
                userId: id,
              })),
            }
          : undefined,
      },

      include: {
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        subTasks: true,
      },
    });

    // 6. Activity log
    await tx.activityLog.create({
      data: {
        type: ActivityType.TASK_CREATED,
        description: `Task "${task.title}" created successfully.`,
        taskId: task.id,
        userId,
      },
    });

    return task;
  });
};

export const getTasksBySprintId = async (
  sprintId: string,
  filters: TaskQueryParams,
) => {
  const { status, priority, search } = filters;

  const whereClause: any = {
    sprintId,
  };

  // ✅ filters (clean + safe)
  if (status) {
    whereClause.status = status;
  }

  if (priority) {
    whereClause.priority = priority;
  }

  if (sprintId) {
    whereClause.sprintId = sprintId;
  }

  // ✅ search (title + description)
  if (search?.trim()) {
    whereClause.OR = [
      {
        title: {
          contains: search.trim(),
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search.trim(),
          mode: 'insensitive',
        },
      },
    ];
  }

  return prisma.task.findMany({
    where: whereClause,

    include: {
      assignees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      },

      subTasks: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },

      _count: {
        select: {
          comments: true,
          attachments: true,
          timeLogs: true,
        },
      },

      sprint: {
        select: {
          id: true,
          title: true,
          sprintNumber: true,
        },
      },
    },

    orderBy: [
      { priority: 'desc' }, // HIGH first (better UX)
      { createdAt: 'desc' },
    ],
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
