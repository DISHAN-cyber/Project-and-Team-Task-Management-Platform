import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/schemas';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, me);

export default router;
