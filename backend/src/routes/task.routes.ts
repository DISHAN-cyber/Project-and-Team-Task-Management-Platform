import { Router } from 'express';
import { listTasks, createTask, getTask, updateTask, deleteTask } from '../controllers/task.controller';
import { listComments, createComment, deleteComment } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema, createCommentSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

router.get('/', listTasks);
router.post('/', requireRole('ADMIN', 'PROJECT_MANAGER'), validate(createTaskSchema), createTask);
router.get('/:id', getTask);
router.patch('/:id', validate(updateTaskSchema), updateTask); // fine-grained checks happen in controller
router.delete('/:id', requireRole('ADMIN', 'PROJECT_MANAGER'), deleteTask);

router.get('/:taskId/comments', listComments);
router.post('/:taskId/comments', validate(createCommentSchema), createComment);
router.delete('/:taskId/comments/:id', deleteComment);

export default router;
