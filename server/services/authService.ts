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
    console.log(`[verifyToken] Verifying token: ${token.substring(0, 15)}...`);
    console.log(`[verifyToken] Using JWT_SECRET: ${JWT_SECRET.substring(0, 5)}...`);
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`[verifyToken] Token successfully verified`);
    return decoded;
  } catch (error) {
    console.error(`[verifyToken] Token verification failed:`, error);
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
    console.log(`[isAdmin] Middleware invoked for ${req.method} ${req.url}`);
    
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    console.log(`[isAdmin] Authorization header present: ${!!authHeader}`);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(`[isAdmin] No Bearer token found`);
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    console.log(`[isAdmin] Token extracted: ${token.substring(0, 15)}...`);
    
    const decoded = verifyToken(token) as DecodedToken;
    console.log(`[isAdmin] Token verification result: ${!!decoded}`);
    
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Invalid token' 
      });
    }
    
    console.log(`[isAdmin] Decoded token info: userId=${decoded.userId}, username=${decoded.username}, role=${decoded.role}`);
    
    if (decoded.role !== 'admin') {
      console.log(`[isAdmin] User role (${decoded.role}) is not admin, access denied`);
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Admin access required' 
      });
    }
    
    // Add user info to request
    req.user = decoded;
    console.log(`[isAdmin] Admin authorization successful, proceeding to next middleware`);
    next();
  } catch (error) {
    console.error(`[isAdmin] Error during authentication:`, error);
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};