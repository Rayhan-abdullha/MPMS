import { Router } from 'express';
import { modifyUser, listTeam } from './users.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
router.use(authenticate);

router.patch('/me', modifyUser);
router.get('/team-members', listTeam);

export default router;
