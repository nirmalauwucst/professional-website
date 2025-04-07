import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-should-be-changed-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain password with a hashed password
 */
export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate a JWT token for a user
 */
export const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Admin authorization middleware
 */
export const isAdmin = (req: any, res: any, next: any) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as DecodedToken;
    
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid token' 
      });
    }
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Admin access required' 
      });
    }
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Authentication failed' 
    });
  }
};