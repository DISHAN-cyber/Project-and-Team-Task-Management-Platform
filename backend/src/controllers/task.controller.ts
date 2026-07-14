import { Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { assertProjectAccess } from './project.controller';

const taskInclude = {
  assignee: { select: { id: true, name: true, email: true, avatarColor: true } },
  creator: { select: { id: true, name: true, email: true, avatarColor: true } },
  project: { select: { id: true, name: true, managerId: true } },
  _count: { select: { comments: true } },
} as const;

// GET /tasks?projectId=&status=&assigneeId=
// Admin: all tasks (optionally filtered). PM: tasks in projects they manage.
// Team Member: only tasks assigned to them.
export async function listTasks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { sub, role } = req.user!;
    const { projectId, status, assigneeId } = req.query as Record<string, string>;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;

    if (role === 'PROJECT_MANAGER') {
      where.project = { managerId: sub };
    } else if (role === 'TEAM_MEMBER') {
      where.assigneeId = sub;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: taskInclude,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

// POST /tasks - Admin or Project Manager (must manage the target project)
export async function createTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { sub, role } = req.user!;
    const { title, description, status, priority, dueDate, assigneeId, projectId } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new ApiError(404, 'Project not found');
    if (role !== 'ADMIN' && project.managerId !== sub) {
      throw new ApiError(403, 'Only the project manager or an admin can create tasks for this project');
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId: assigneeId || undefined,
        projectId,
        creatorId: sub,
      },
      include: taskInclude,
    });

    await prisma.activityLog.create({
      data: { action: 'TASK_CREATED', details: task.title, userId: sub, projectId, taskId: task.id },
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

// GET /tasks/:id
export async function getTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id }, include: taskInclude });
    if (!task) throw new ApiError(404, 'Task not found');

    const { sub, role } = req.user!;
    if (role === 'TEAM_MEMBER' && task.assigneeId !== sub) {
      throw new ApiError(403, 'You can only view tasks assigned to you');
    }
    await assertProjectAccess(task.projectId, sub, role);

    res.json({ task });
  } catch (err) {
    next(err);
  }
}

// PATCH /tasks/:id
// Admin/PM (managing project): can edit everything.
// Team Member: can only update status/description on tasks assigned to them.
export async function updateTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { sub, role } = req.user!;
    const { id } = req.params;

    const existing = await prisma.task.findUnique({ where: { id }, include: { project: true } });
    if (!existing) throw new ApiError(404, 'Task not found');

    const isManager = role === 'ADMIN' || existing.project.managerId === sub;
    const isAssignee = existing.assigneeId === sub;

    if (!isManager && !isAssignee) {
      throw new ApiError(403, 'You do not have permission to update this task');
    }

    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    // Team members may only change status and description on their own tasks
    const data: any = isManager
      ? {
          title,
          description,
          status,
          priority,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          assigneeId: assigneeId === null ? null : assigneeId || undefined,
        }
      : { status, description };

    const task = await prisma.task.update({ where: { id }, data, include: taskInclude });

    if (status && status !== existing.status) {
      await prisma.activityLog.create({
        data: {
          action: 'TASK_STATUS_CHANGED',
          details: `${task.title}: ${existing.status} -> ${status}`,
          userId: sub,
          projectId: task.projectId,
          taskId: task.id,
        },
      });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
}

// DELETE /tasks/:id - Admin or managing PM
export async function deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { sub, role } = req.user!;
    const { id } = req.params;

    const existing = await prisma.task.findUnique({ where: { id }, include: { project: true } });
    if (!existing) throw new ApiError(404, 'Task not found');
    if (role !== 'ADMIN' && existing.project.managerId !== sub) {
      throw new ApiError(403, 'Only the project manager or an admin can delete this task');
    }

    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
