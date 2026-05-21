import { Request, Response, NextFunction } from 'express';
import * as taskService from './tasks.service';

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const operatorId = req.user!.id;
    const task = await taskService.createTask(projectId, operatorId, req.body);
    res.status(201).json({ status: 'success', data: { task } });
  } catch (error) {
    next(error);
  }
};

export const getProjectTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tasks = await taskService.getTasksByProject(
      req.params.projectId,
      req.query,
    );
    res.status(200).json({ status: 'success', data: { tasks } });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const operatorId = req.user!.id;
    const task = await taskService.updateTask(
      req.params.id,
      operatorId,
      req.body,
    );
    res.status(200).json({ status: 'success', data: { task } });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
