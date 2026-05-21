import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import env from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails: any = null;

  // 🔴 Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  // 🔴 Prisma Errors
  else if (err?.code?.startsWith('P')) {
    statusCode = 400;

    switch (err.code) {
      case 'P2002':
        message = 'Duplicate field value';
        break;
      case 'P2025':
        message = 'Record not found';
        break;
      default:
        message = 'Database error';
    }
  }

  // 🔴 JWT Errors
  else if (err?.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err?.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // 🔴 Custom App Error (optional support)
  else if (err?.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // 🚀 Response (sanitized)
  res.status(statusCode).json({
    success: false,
    message,
    ...(errorDetails && { errors: errorDetails }),

    // only show stack in dev
    ...(env.node_env === 'development' && {
      stack: err.stack,
    }),
  });
};
