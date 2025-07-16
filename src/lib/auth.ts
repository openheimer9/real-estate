import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface AuthData {
  userId: string;
  email: string;
  role: string;
}

interface AuthResult {
  success: boolean;
  data?: AuthData;
  error?: string;
}

export async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AuthResult> {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return { success: false, error: 'No token provided' };
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthData;
    
    return { success: true, data: decoded };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Role-based middleware
export function withRoles(roles: string[]) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      const auth = await authMiddleware(req, res);
      
      if (!auth.success) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      if (!roles.includes(auth.data?.role || '')) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      
      next();
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
}