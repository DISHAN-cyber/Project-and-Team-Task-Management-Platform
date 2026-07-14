import { Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

async function assertTaskAccess(taskId: string, userId: string, role: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
  if (!task) throw new ApiError(404, 'Task not found');
  if (role === 'ADMIN') return task;
  if (role === 'PROJECT_MANAGER' && task.project.managerId === userId) return task;
  if (task.assigneeId === userId) return task;
  throw new ApiError(403, 'You do not have access to this task');
}

// GET /tasks/:taskId/comments
export async function listComments(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    await assertTaskAccess(taskId, req.user!.sub, req.user!.role);

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { author: { select: { id: true, name: true, avatarColor: true, role: true } } },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ comments });
  } catch (err) {
    next(err);
  }
}

// POST /tasks/:taskId/comments
export async function createComment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const { sub, role } = req.user!;
    await assertTaskAccess(taskId, sub, role);

    const comment = await prisma.comment.create({
      data: { content: req.body.content, taskId, authorId: sub },
      include: { author: { select: { id: true, name: true, avatarColor: true, role: true } } },
    });
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
}

// DELETE /comments/:id - author, or Admin/managing PM
export async function deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { sub, role } = req.user!;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { task: { include: { project: true } } },
    });
    if (!comment) throw new ApiError(404, 'Comment not found');

    const canDelete = comment.authorId === sub || role === 'ADMIN' || comment.task.project.managerId === sub;
    if (!canDelete) throw new ApiError(403, 'You do not have permission to delete this comment');

    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
