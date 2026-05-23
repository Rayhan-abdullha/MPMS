// Look at how simple routing files stay!
import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from './projects.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import {
  createProjectSchema,
  updateProjectSchema,
} from './projects.validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(createProjectSchema),
  createProject,
);

router.get('/', authenticate, getAllProjects);

router.get('/:id', authenticate, getProjectById);
router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  validate(updateProjectSchema),
  updateProject,
);

router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteProject);

export default router;
