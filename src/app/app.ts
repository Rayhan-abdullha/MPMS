import express from 'express';
import type { Application, NextFunction } from 'express-serve-static-core';
import type { Request, Response } from 'express-serve-static-core';
import { sendData } from '../utils/utils';
import cors from 'cors';
const app: Application = express();
import authRoutes from '../modules/auth/auth.route';
import projectRoutes from '../modules/projects/projects.routes';
import { errorHandler } from '../middleware/errorHandler';
import { notFoundHandler } from '../middleware/nofound';
app.get('/health', (req: Request, res: Response) => {
  sendData(
    res,
    {
      success: true,
      message: 'Hello, World!',
      data: null,
    },
    200,
  );
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
