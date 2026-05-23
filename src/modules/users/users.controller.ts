import { Request, Response, NextFunction } from 'express';
import * as userService from './users.service';
import { UserRole } from '@prisma/client';

export const modifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.updateProfile(req.user!.id, req.body);
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

export const listTeam = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const teams = await userService.getTeamDirectory({
      role: 'MEMBER',
    });
    res.status(200).json({ status: 'success', data: { teams } });
  } catch (error) {
    next(error);
  }
};
