import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';

/**
 * Restricts a route to the given list of roles.
 * Usage: router.get('/', authenticate, requireRole('ADMIN'), handler)
 */
export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    next();
  };
}
