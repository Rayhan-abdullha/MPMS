import prisma from '../../config/prisma';
import { CreateSprintInput, UpdateSprintInput } from './sprints.types';

export const createSprint = async (
  projectId: string,
  data: CreateSprintInput,
) => {
  // Check if project exists
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    const error = new Error('Project not found');
    (error as any).statusCode = 404;
    throw error;
  }

  // Auto-increment sprint number per project using an aggregate query
  const aggregate = await prisma.sprint.aggregate({
    where: { projectId },
    _max: { sprintNumber: true },
  });
  const nextSprintNumber = (aggregate._max.sprintNumber || 0) + 1;

  return await prisma.sprint.create({
    data: {
      title: data.title,
      sprintNumber: nextSprintNumber,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      order: data.order || 0,
      projectId,
    },
  });
};

export const getSprintsByProject = async (projectId: string) => {
  return await prisma.sprint.findMany({
    where: { projectId },
    orderBy: { order: 'asc' },
    include: { _count: { select: { tasks: true } } },
  });
};

export const updateSprint = async (
  sprintId: string,
  data: UpdateSprintInput,
) => {
  const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } });
  if (!sprint) {
    const error = new Error('Sprint not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return await prisma.sprint.update({
    where: { id: sprintId },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
};

export const deleteSprint = async (sprintId: string) => {
  const sprint = await prisma.sprint.findUnique({ where: { id: sprintId } });
  if (!sprint) {
    const error = new Error('Sprint not found');
    (error as any).statusCode = 404;
    throw error;
  }

  await prisma.sprint.delete({ where: { id: sprintId } });
};
