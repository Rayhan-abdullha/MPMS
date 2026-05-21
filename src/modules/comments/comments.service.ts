import prisma from '../../config/prisma';
import { CreateCommentInput } from './comments.types';
import { ActivityType } from '@prisma/client';

export const addCommentToTask = async (
  taskId: string,
  userId: string,
  data: CreateCommentInput,
) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    const error = new Error('Target task context missing');
    (error as any).statusCode = 404;
    throw error;
  }

  if (data.parentCommentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: data.parentCommentId },
    });
    if (!parent) {
      const error = new Error('Parent thread item missing');
      (error as any).statusCode = 404;
      throw error;
    }
  }

  return await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        content: data.content,
        taskId,
        userId,
        parentCommentId: data.parentCommentId || null,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        replies: true,
      },
    });

    await tx.activityLog.create({
      data: {
        type: ActivityType.COMMENT_CREATED,
        description: `New comment added to task.`,
        taskId,
        userId,
      },
    });

    return comment;
  });
};

export const getTaskCommentsTree = async (taskId: string) => {
  // Fetch root comments and deeply map their recursive child relations
  return await prisma.comment.findMany({
    where: { taskId, parentCommentId: null },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      replies: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          replies: true, // Support deep levels
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};
