import { Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

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
    // 1. Added 'role' to the destructured variables
    const { name, email, password, role } = req.body;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError(409, 'An account with this email already exists');

    const passwordHash = await hashPassword(password);
    
    // 2. Use the role from the request, or default to 'TEAM_MEMBER' for safety
    const userRole = role || 'TEAM_MEMBER';

    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        passwordHash, 
        role: userRole // <-- Now it saves the selected role!
      },
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

// ==========================================
// NEW: Forgot Password & Reset Password
// ==========================================

export async function forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Security best practice: Always return success, even if email doesn't exist
    if (!user) {
      return res.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await hashPassword(resetToken);
    const expiresAt = new Date(Date.now() + 3600000); // Expires in 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
      },
    });

    // NOTE: In a real production app, you would send an email here with the resetToken.
    // For this assignment/testing, we return it in the response so you can copy it.
    res.json({ 
      message: 'Password reset instructions sent.',
      resetToken // ⚠️ Remove this line in production!
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new ApiError(400, 'Token and new password are required');
    }

    // Find the unexpired token record
    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetRecord) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }

    // Verify the token matches the hashed token in the database
    const isValid = await comparePassword(token, resetRecord.token);
    if (!isValid) {
      throw new ApiError(400, 'Invalid reset token');
    }

    // Update the user's password
    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    });

    // Delete the used token so it can't be reused
    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    res.json({ message: 'Password has been successfully reset.' });
  } catch (err) {
    next(err);
  }
}