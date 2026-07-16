import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getTMProjects } from '../controllers/tm-projects.controller';

const router = Router();

// GET /api/tm/projects - Get all projects assigned to team member
router.get('/projects', authMiddleware, getTMProjects);

export default router;