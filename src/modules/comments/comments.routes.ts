import { Router } from 'express';
import { postComment, getComments } from './comments.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();
router.use(authenticate);

router.route('/task/:taskId').post(postComment).get(getComments);

export default router;
