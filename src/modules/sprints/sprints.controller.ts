import { Request, Response, NextFunction } from 'express';
import * as sprintService from './sprints.service';

export const createSprint = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const sprint = await sprintService.createSprint(projectId, req.body);
    res.status(201).json({ status: 'success', data: { sprint } });
  } catch (error) {
    next(error);
  }
};

export const getProjectSprints = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sprints = await sprintService.getSprintsByProject(
      req.params.projectId,
    );
    res.status(200).json({ status: 'success', data: { sprints } });
  } catch (error) {
    next(error);
  }
};

export const updateSprint = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sprint = await sprintService.updateSprint(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: { sprint } });
  } catch (error) {
    next(error);
  }
};

export const deleteSprint = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await sprintService.deleteSprint(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
