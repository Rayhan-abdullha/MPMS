import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendResponse } from '../../utils/utils';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newUser = await authService.registerUser(req.body);

    return sendResponse(
      res,
      {
        success: true,
        data: newUser,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authData = await authService.loginUser(req.body);

    res.cookie('mpms_auth_token', authData.accessToken, {
      httpOnly: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('mpms_user', authData.user, {
      httpOnly: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, {
      success: true,
      data: authData,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Logging out...');
  try {
    res.clearCookie('mpms_auth_token', { path: '/' });
    res.clearCookie('mpms_user', { path: '/' });
    return sendResponse(res, {
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
