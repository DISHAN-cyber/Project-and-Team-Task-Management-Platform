import { Router } from 'express';
import {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createProjectSchema, updateProjectSchema, addMemberSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

router.get('/', listProjects);
router.post('/', requireRole('ADMIN', 'PROJECT_MANAGER'), validate(createProjectSchema), createProject);
router.get('/:id', getProject);
router.patch('/:id', requireRole('ADMIN', 'PROJECT_MANAGER'), validate(updateProjectSchema), updateProject);
router.delete('/:id', requireRole('ADMIN', 'PROJECT_MANAGER'), deleteProject);

router.post('/:id/members', requireRole('ADMIN', 'PROJECT_MANAGER'), validate(addMemberSchema), addMember);
router.delete('/:id/members/:userId', requireRole('ADMIN', 'PROJECT_MANAGER'), removeMember);

export default router;
