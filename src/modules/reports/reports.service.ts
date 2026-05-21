import prisma from '../../config/prisma';
import { TaskStatus } from '@prisma/client';

export const getProjectDashboardMetrics = async (projectId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    const error = new Error('Project calculations failed: target not found');
    (error as any).statusCode = 404;
    throw error;
  }

  const tasksGroup = await prisma.task.groupBy({
    by: ['status'],
    where: { projectId },
    _count: { id: true },
    _sum: { estimateHours: true },
  });

  const totalTimeLogs = await prisma.timeLog.aggregate({
    where: { task: { projectId } },
    _sum: { hours: true },
  });

  // Structural mapping calculations calculations
  let totalTasks = 0;
  let doneTasks = 0;

  tasksGroup.forEach((group) => {
    totalTasks += group._count.id;
    if (group.status === TaskStatus.DONE) {
      doneTasks = group._count.id;
    }
  });

  const completionPercentage =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return {
    projectId,
    title: project.title,
    completionPercentage,
    totalTasksCount: totalTasks,
    breakdown: tasksGroup.map((g) => ({
      status: g.status,
      count: g._count.id,
    })),
    hoursLoggedSummary: totalTimeLogs._sum.hours || 0,
  };
};
