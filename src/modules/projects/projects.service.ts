import prisma from '../../config/prisma';
import { ProjectStatus } from '@prisma/client';
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryParams,
  PaginatedProjectsResponse,
} from './projects.types';

export const createNewProject = async (
  data: CreateProjectInput,
  creatorId: string,
) => {
  return await prisma.project.create({
    data: {
      title: data.title,
      client: data.client,
      description: data.description,
      budget: data.budget,
      thumbnail: data.thumbnail,
      status: data.status || ProjectStatus.PLANNED,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      createdById: creatorId,
    },
  });
};

export const fetchAllProjects = async (
  query: ProjectQueryParams,
): Promise<PaginatedProjectsResponse> => {
  const { status, client, search, page = '1', limit = '10' } = query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Build Dynamic Queries safely
  const whereClause: any = {};

  if (status) whereClause.status = status;
  if (client) whereClause.client = { contains: client, mode: 'insensitive' };

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where: whereClause,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true, sprints: true } },
      },
    }),
    prisma.project.count({ where: whereClause }),
  ]);

  return {
    results: projects.length,
    meta: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    },
    projects,
  };
};

export const fetchProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      sprints: true,
      tasks: true,
    },
  });

  if (!project) {
    const error = new Error('Project not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return project;
};

export const updateProjectById = async (
  id: string,
  updateData: UpdateProjectInput,
) => {
  const existingProject = await prisma.project.findUnique({ where: { id } });
  if (!existingProject) {
    const error = new Error('Project not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return await prisma.project.update({
    where: { id },
    data: {
      ...updateData,
      startDate: updateData.startDate
        ? new Date(updateData.startDate)
        : undefined,
      endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
    },
  });
};

export const removeProjectById = async (id: string): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const existingProject = await tx.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingProject) {
      const error = new Error('Project not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Delete all activity logs related to tasks in this project
    await tx.activityLog.deleteMany({
      where: {
        task: {
          projectId: id,
        },
      },
    });

    // Delete project
    await tx.project.delete({
      where: { id },
    });
  });
};
