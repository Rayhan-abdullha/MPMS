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

router.use(authenticate);

router
  .route('/')
  .post(
    authenticate,
    authorize(UserRole.ADMIN, UserRole.MANAGER),
    validate(createProjectSchema),
    createProject,
  )
  .get(getAllProjects);

router
  .route('/:id')
  .get(getProjectById)
  .patch(
    authenticate,
    authorize(UserRole.ADMIN, UserRole.MANAGER),
    validate(updateProjectSchema),
    updateProject,
  )
  .delete(authenticate, authorize(UserRole.ADMIN), deleteProject);

export default router;
