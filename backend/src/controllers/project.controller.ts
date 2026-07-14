import { Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const projectInclude = {
  manager: { select: { id: true, name: true, email: true, avatarColor: true } },
  members: { include: { user: { select: { id: true, name: true, email: true, avatarColor: true, role: true } } } },
  _count: { select: { tasks: true } },
} as const;

// Helper: does this user have access to this project (as manager or member), or are they Admin?
async function assertProjectAccess(projectId: string, userId: string, role: string) {
  if (role === 'ADMIN') return;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  if (!project) throw new ApiError(404, 'Project not found');
  const isManager = project.managerId === userId;
  const isMember = project.members.some((m: { userId: string }) => m.userId === userId);
  if (!isManager && !isMember) throw new ApiError(403, 'You do not have access to this project');
}

// GET /projects
// Admin: all projects. PM: projects they manage. Team Member: projects they belong to.
export async function listProjects(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { sub, role } = req.user!;
    let where = {};
    if (role === 'PROJECT_MANAGER') where = { managerId: sub };
    if (role === 'TEAM_MEMBER') where = { members: { some: { userId: sub } } };

    const projects = await prisma.project.findMany({
      where,
      include: projectInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

// POST /projects - Admin or Project Manager
export async function createProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, description, status, startDate, endDate, memberIds } = req.body;
    const { sub, role } = req.user!;

    // A Project Manager always becomes the manager of projects they create.
    // An Admin may create a project and assign any PM as manager via managerId (defaults to self).
    const managerId = role === 'ADMIN' && req.body.managerId ? req.body.managerId : sub;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status: status || 'PLANNED',
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        managerId,
        members: memberIds?.length ? { create: memberIds.map((userId: string) => ({ userId })) } : undefined,
      },
      include: projectInclude,
    });

    await prisma.activityLog.create({
      data: { action: 'PROJECT_CREATED', details: project.name, userId: sub, projectId: project.id },
    });

    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

// GET /projects/:id
export async function getProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await assertProjectAccess(id, req.user!.sub, req.user!.role);

    const project = await prisma.project.findUnique({ where: { id }, include: projectInclude });
    if (!project) throw new ApiError(404, 'Project not found');
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

// PATCH /projects/:id - Admin or the managing Project Manager
export async function updateProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { sub, role } = req.user!;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, 'Project not found');
    if (role !== 'ADMIN' && existing.managerId !== sub) {
      throw new ApiError(403, 'Only the project manager or an admin can update this project');
    }

    const { name, description, status, startDate, endDate, managerId } = req.body;
    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        managerId: role === 'ADMIN' ? managerId : undefined,
      },
      include: projectInclude,
    });

    await prisma.activityLog.create({
      data: { action: 'PROJECT_UPDATED', details: project.name, userId: sub, projectId: project.id },
    });

    res.json({ project });
  } catch (err) {
    next(err);
  }
}

// DELETE /projects/:id - Admin or managing PM
export async function deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { sub, role } = req.user!;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, 'Project not found');
    if (role !== 'ADMIN' && existing.managerId !== sub) {
      throw new ApiError(403, 'Only the project manager or an admin can delete this project');
    }

    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// POST /projects/:id/members - Admin or managing PM: add a team member
export async function addMember(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const { sub, role } = req.user!;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new ApiError(404, 'Project not found');
    if (role !== 'ADMIN' && project.managerId !== sub) {
      throw new ApiError(403, 'Only the project manager or an admin can add members');
    }

    const member = await prisma.projectMember.create({ data: { projectId: id, userId } });
    res.status(201).json({ member });
  } catch (err) {
    next(err);
  }
}

// DELETE /projects/:id/members/:userId - Admin or managing PM: remove a team member
export async function removeMember(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id, userId } = req.params;
    const { sub, role } = req.user!;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new ApiError(404, 'Project not found');
    if (role !== 'ADMIN' && project.managerId !== sub) {
      throw new ApiError(403, 'Only the project manager or an admin can remove members');
    }

    await prisma.projectMember.delete({ where: { projectId_userId: { projectId: id, userId } } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export { assertProjectAccess };
