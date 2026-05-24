import { Router } from 'express';
import * as sprintController from './sprints.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { createSprintSchema, updateSprintSchema } from './sprints.validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

// DONE
router
  .route('/project/:projectId')
  .post(
    authorize(UserRole.ADMIN, UserRole.MANAGER),
    validate(createSprintSchema),
    sprintController.createSprint,
  )
  .get(sprintController.getProjectSprints);

// NOT DONE
router
  .route('/:id')
  .patch(
    authorize(UserRole.ADMIN, UserRole.MANAGER),
    validate(updateSprintSchema),
    sprintController.updateSprint,
  )
  .delete(
    authorize(UserRole.ADMIN, UserRole.MANAGER),
    sprintController.deleteSprint,
  );

// DONE
router.get('/', sprintController.getAllSprints);

export default router;
