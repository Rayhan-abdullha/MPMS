// Look at how simple routing files stay!
import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from './projects.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/valildate';
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
    authorize(UserRole.ADMIN, UserRole.MANAGER),
    validate(createProjectSchema),
    createProject,
  )
  .get(getAllProjects);

router
  .route('/:id')
  .get(getProjectById)
  .patch(
    authorize(UserRole.ADMIN, UserRole.MANAGER),
    validate(updateProjectSchema),
    updateProject,
  )
  .delete(authorize(UserRole.ADMIN), deleteProject);

export default router;
