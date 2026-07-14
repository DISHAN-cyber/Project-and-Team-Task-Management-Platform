import { Router } from 'express';
import { listUsers, createUser, getUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { registerSchema, updateUserSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

// Admin + PM can list users (PM needs this to assign members/tasks); only Admin can mutate.
router.get('/', requireRole('ADMIN', 'PROJECT_MANAGER'), listUsers);
router.post('/', requireRole('ADMIN'), validate(registerSchema), createUser);
router.get('/:id', requireRole('ADMIN', 'PROJECT_MANAGER'), getUser);
router.patch('/:id', requireRole('ADMIN'), validate(updateUserSchema), updateUser);
router.delete('/:id', requireRole('ADMIN'), deleteUser);

export default router;
