import { Router } from 'express';
import { login, register } from './auth.controller';
import { validate } from '../../middleware/valildate';
import { loginSchema, registerSchema } from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
