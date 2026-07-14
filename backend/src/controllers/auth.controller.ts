import { Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
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

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError(409, 'An account with this email already exists');

    const passwordHash = await hashPassword(password);
    // Public self-registration is always a Team Member. Admins can change roles later
    // via PATCH /users/:id, or create PM/Admin accounts directly via POST /users.
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: 'TEAM_MEMBER' },
      select: publicUser,
    });

    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(401, 'Invalid email or password');

    if (!user.isActive) throw new ApiError(403, 'This account has been deactivated');

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new ApiError(401, 'Invalid email or password');

    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    const safeUser: Record<string, unknown> = { ...user };
    delete safeUser.passwordHash;
    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: publicUser,
    });
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
