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
    const roleParam = req.query.role as UserRole | undefined;
    const users = await userService.getTeamDirectory({
      department: req.query.department as string,
      role: roleParam,
    });
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
};
