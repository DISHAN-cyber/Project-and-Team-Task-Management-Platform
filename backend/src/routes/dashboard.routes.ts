import { Router } from 'express';
import { getSummary } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/summary', getSummary);

export default router;
