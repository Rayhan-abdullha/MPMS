import { Request, Response, NextFunction } from 'express';
import * as taskService from './tasks.service';
import { sendResponse } from '../../utils/utils';

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sprintId } = req.params;
    const operatorId = req.user!.id;
    const task = await taskService.createTask(sprintId, operatorId, req.body);
    sendResponse(
      res,
      {
        success: true,
        message: 'Task has been created successfully.',
        data: task,
      },
      201,
    );
    return;
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
    const tasks = await taskService.getTasksBySprintId(
      req.params.sprintId,
      req.query,
    );
    sendResponse(
      res,
      { success: true, message: 'Get all tasks', data: { tasks } },
      200,
    );
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const taskId = req.params?.taskId;
  if (!taskId) {
    sendResponse(res, { success: false, message: 'Task id required' }, 400);
    return;
  }
  try {
    const operatorId = req.user!.id;
    const task = await taskService.updateTaskStatus(
      taskId,
      operatorId,
      req.body.status,
    );
    sendResponse(
      res,
      {
        success: true,
        message: 'Successfully updated task',
        data: { task },
      },
      200,
    );
  } catch (error) {
    next(error);
  }
};

export const updateTaskDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const taskId = req.params?.taskId;
  if (!taskId) {
    res.status(200).json({ success: false, message: 'Task id required' });
    return;
  }
  try {
    const operatorId = req.user!.id;
    const task = await taskService.updateTaskDetails(
      taskId,
      operatorId,
      req.body,
    );
    sendResponse(
      res,
      {
        success: true,
        message: 'Successfully updated task',
        data: { task },
      },
      200,
    );
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const taskId = req.params.taskId;
  if (!taskId) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Task id required',
      },
      400,
    );
    return;
  }
  try {
    await taskService.deleteTask(taskId);
    sendResponse(
      res,
      {
        success: true,
        message: 'Successfully deleted task',
      },
      200,
    );
  } catch (error) {
    next(error);
  }
};
export const getAssignedToMeTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tasks = await taskService.getAssignedToMeTasks(req.user!.id);
    sendResponse(
      res,
      { success: true, message: 'Get all assigned tasks', data: { tasks } },
      200,
    );
  } catch (error) {
    next(error);
  }
};

// export const getActivities = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const activities = await taskService.getActivities(req.params.id);
//     res.status(200).json({ status: 'success', data: { activities } });
//   } catch (error) {
//     next(error);
//   }
// };
