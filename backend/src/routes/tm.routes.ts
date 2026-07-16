import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getTMProjects } from '../controllers/tm.controller';

const router = Router();

// Apply auth middleware to all TM routes
router.use(authMiddleware);

// GET /api/tm/projects - Get all projects assigned to the logged-in team member
router.get('/projects', getTMProjects);

export default router;