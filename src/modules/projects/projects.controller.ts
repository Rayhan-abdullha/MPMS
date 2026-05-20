import { Request, Response, NextFunction } from 'express';
import * as projectService from './projects.service';

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const creatorId = req.user!.id; // Captured natively by authenticate middleware
    const project = await projectService.createNewProject(req.body, creatorId);

    res.status(201).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await projectService.fetchAllProjects(req.query);

    res.status(200).json({
      status: 'success',
      results: result.results,
      meta: result.meta,
      data: { projects: result.projects },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const project = await projectService.fetchProjectById(req.params.id);
    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const project = await projectService.updateProjectById(
      req.params.id,
      req.body,
    );
    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await projectService.removeProjectById(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
