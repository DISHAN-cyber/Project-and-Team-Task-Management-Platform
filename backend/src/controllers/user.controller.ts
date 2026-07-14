import { Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { hashPassword } from '../utils/password';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const publicUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  avatarColor: true,
  createdAt: true,
} as const;

// GET /users - Admin: list all users. PM: list users for assignment purposes (limited fields).
export async function listUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      select: publicUser,
      orderBy: { createdAt: 'asc' },
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

// POST /users - Admin only: create a user with any role
export async function createUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError(409, 'An account with this email already exists');

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: role || 'TEAM_MEMBER' },
      select: publicUser,
    });

    await prisma.activityLog.create({
      data: { action: 'USER_CREATED', details: `${user.email} (${user.role})`, userId: req.user!.sub },
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

// GET /users/:id
export async function getUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: publicUser });
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// PATCH /users/:id - Admin only: update role, active status, or name
export async function updateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, role, isActive } = req.body;

    if (id === req.user!.sub && role && role !== req.user!.role) {
      throw new ApiError(400, 'You cannot change your own role');
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name, role, isActive },
      select: publicUser,
    });

    await prisma.activityLog.create({
      data: { action: 'USER_UPDATED', details: `${user.email}`, userId: req.user!.sub },
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// DELETE /users/:id - Admin only
export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (id === req.user!.sub) throw new ApiError(400, 'You cannot delete your own account');

    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
