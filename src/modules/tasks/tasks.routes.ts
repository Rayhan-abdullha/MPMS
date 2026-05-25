import { Router } from 'express';
import * as taskController from './tasks.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { createTaskSchema, updateTaskSchema } from './tasks.validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post(
  '/sprints/:sprintId',
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createTaskSchema),
  taskController.createTask,
);
router.get(
  '/sprints/:sprintId',
  authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER),
  taskController.getProjectTasks,
);
router.patch(
  '/:taskId/status',
  authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER),
  validate(updateTaskSchema),
  taskController.updateTaskStatus,
);
router.put(
  '/:taskId',
  authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER),
  validate(updateTaskSchema),
  taskController.updateTaskDetails,
);
router.delete(
  '/:taskId',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  taskController.deleteTask,
);
router.get(
  '/assigned-to-me',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER),
  taskController.getAssignedToMeTasks,
);
// router.get("/activities", taskController.getActivities);

export default router;
