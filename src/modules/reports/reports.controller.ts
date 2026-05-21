import { Request, Response, NextFunction } from 'express';
import * as reportService from './reports.service';

export const queryProjectReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const stats = await reportService.getProjectDashboardMetrics(
      req.params.projectId,
    );
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
};
