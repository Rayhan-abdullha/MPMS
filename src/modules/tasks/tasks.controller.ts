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
    res.status(200).json({ status: 'success', data: { tasks } });
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
  console.log(taskId);
  if (!taskId) {
    res.status(200).json({ success: false, message: 'Task id required' });
    return;
  }
  try {
    const operatorId = req.user!.id;
    const task = await taskService.updateTaskStatus(
      taskId,
      operatorId,
      req.body.status,
    );
    res.status(200).json({ status: 'success', data: { task } });
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
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).json({ status: 'success', data: null });
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
    sendResponse(res, { success: true, data: { tasks } }, 200);
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
