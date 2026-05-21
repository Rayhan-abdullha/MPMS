import { Router, RequestHandler } from 'express';
import { login, logoutController, register } from './auth.controller';
import { validate } from '../../middlewares/validate';
import { loginSchema, registerSchema } from './auth.validation';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.post('/register', validate(registerSchema), register as RequestHandler);
router.post('/login', validate(loginSchema), login as RequestHandler);
router.post('/logout', logoutController as RequestHandler);

export default router;
