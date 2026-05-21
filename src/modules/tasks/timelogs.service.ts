import prisma from '../../config/prisma';

export const logWorkTime = async (
  taskId: string,
  userId: string,
  hours: number,
  description?: string,
) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    const error = new Error('Task context not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return await prisma.timeLog.create({
    data: {
      hours,
      description,
      taskId,
      userId,
    },
  });
};
