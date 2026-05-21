import express from 'express';
import cors from 'cors';
import authRoutes from '../modules/auth/auth.routes';
import projectRoutes from '../modules/projects/projects.routes';
import sprintRoutes from '../modules/sprints/sprints.routes';
import taskRoutes from '../modules/tasks/tasks.routes';
import commentRoutes from '../modules/comments/comments.routes';
import userRoutes from '../modules/users/users.routes';
import reportRoutes from '../modules/reports/reports.routes';
import { notFoundHandler } from '../middlewares/nofound';
import { errorHandler } from '../middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Complete API Registration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/sprints', sprintRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/reports', reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
