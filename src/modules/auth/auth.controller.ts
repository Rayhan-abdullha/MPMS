import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const newUser = await authService.registerUser(req.body);

    res.status(201).json({
      status: 'success',
      data: { user: newUser },
    });
  } catch (error) {
    next(error); // Passes the custom errors gracefully down to your global error handler middleware
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authData = await authService.loginUser(req.body);

    res.status(200).json({
      status: 'success',
      data: authData,
    });
  } catch (error) {
    next(error);
  }
};
