import { Router } from 'express';
import { queryProjectReport } from './reports.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();
router.use(authenticate);

router.get(
  '/project/:projectId',
  authorize(UserRole.ADMIN, UserRole.MANAGER),
  queryProjectReport,
);

export default router;
