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

const corsOptions = {
  origin: ['http://localhost:3000', 'https://task-mpms.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy..' });
});

// Complete API Registration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/sprints', sprintRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/reports', reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
