import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthData {
  userId: string;
  email: string;
  role: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthData;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Token verification failed';
    return res.status(401).json({ message: 'Unauthorized', error: message });
  }
}

// Role-based middleware
export function withRoles(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
}