import { Router } from 'express';
import * as taskController from './tasks.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { createTaskSchema, updateTaskSchema } from './tasks.validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Contextual routing parameters mapping against structural Project parents
router
  .route('/project/:projectId')
  .post(
    authorize(UserRole.ADMIN, UserRole.MANAGER),
    validate(createTaskSchema),
    taskController.createTask,
  )
  .get(taskController.getProjectTasks);

// Independent operations tracking explicitly targets
router
  .route('/:id')
  .patch(
    authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER),
    validate(updateTaskSchema),
    taskController.updateTask,
  )
  .delete(
    authorize(UserRole.ADMIN, UserRole.MANAGER),
    taskController.deleteTask,
  );

export default router;
