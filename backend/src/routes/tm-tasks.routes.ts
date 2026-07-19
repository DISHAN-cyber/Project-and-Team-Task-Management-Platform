import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getTMTasks, uploadTaskFiles, deleteTaskFile } from '../controllers/tm-tasks.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/tm/tasks - Get all tasks
router.get('/tasks', getTMTasks);

// POST /api/tm/tasks/:taskId/upload - Upload files
router.post('/tasks/:taskId/upload', upload.array('files', 10), uploadTaskFiles);

// DELETE /api/tm/tasks/:taskId/files/:fileId - Delete file
router.delete('/tasks/:taskId/files/:fileId', deleteTaskFile);

export default router;