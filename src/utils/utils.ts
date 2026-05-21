import type { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export function sendResponse<T>(
  res: Response,
  apiResponse: ApiResponse<T>,
  status: number = 200,
): Response {
  return res.status(status).json({
    status,
    ...apiResponse,
  });
}
