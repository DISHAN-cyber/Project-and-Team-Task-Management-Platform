import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
  email: string;
}

const ACCESS_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}
