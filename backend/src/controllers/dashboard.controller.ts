import { Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';

// GET /dashboard/summary - role-aware counts + recent activity feed
export async function getSummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { sub, role } = req.user!;

    let projectWhere: any = {};
    let taskWhere: any = {};
    let activityWhere: any = {};

    if (role === 'PROJECT_MANAGER') {
      projectWhere = { managerId: sub };
      taskWhere = { project: { managerId: sub } };
      activityWhere = { project: { managerId: sub } };
    } else if (role === 'TEAM_MEMBER') {
      projectWhere = { members: { some: { userId: sub } } };
      taskWhere = { assigneeId: sub };
      activityWhere = { userId: sub };
    }

    const [totalProjects, activeProjects, totalTasks, tasksByStatus, overdueTasks, recentActivity, totalUsers] =
      await Promise.all([
        prisma.project.count({ where: projectWhere }),
        prisma.project.count({ where: { ...projectWhere, status: 'ACTIVE' } }),
        prisma.task.count({ where: taskWhere }),
        prisma.task.groupBy({ by: ['status'], where: taskWhere, _count: true }),
        prisma.task.count({
          where: { ...taskWhere, dueDate: { lt: new Date() }, status: { not: 'DONE' } },
        }),
        prisma.activityLog.findMany({
          where: activityWhere,
          include: { user: { select: { name: true, avatarColor: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
        role === 'ADMIN' ? prisma.user.count() : Promise.resolve(undefined),
      ]);

    res.json({
      totalProjects,
      activeProjects,
      totalTasks,
      tasksByStatus,
      overdueTasks,
      recentActivity,
      ...(totalUsers !== undefined ? { totalUsers } : {}),
    });
  } catch (err) {
    next(err);
  }
}
