import { Router, Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { 
  hashPassword, 
  comparePasswords, 
  generateToken, 
  isAdmin,
  DecodedToken
} from '../services/authService';

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

const router = Router();

/**
 * Login route for admin CMS
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    // Get user from database
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required'
      });
    }
    
    // Verify password
    const isMatch = await comparePasswords(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
});

/**
 * Register admin user (should be restricted in production)
 * This route is primarily for initial setup
 * POST /api/auth/register-admin
 */
router.post('/register-admin', async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create admin user
    const user = await storage.createUser({
      username,
      password: hashedPassword,
      name,
      email,
      role: 'admin'
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Send response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

/**
 * Get current user data
 * GET /api/auth/me
 */
router.get('/me', isAdmin, async (req, res) => {
  try {
    console.log('GET /api/auth/me - Headers:', JSON.stringify(req.headers));
    console.log('GET /api/auth/me - User object:', JSON.stringify(req.user || 'No user found'));
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userId = req.user.userId;
    
    // Get user from database
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Send response
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data',
      error: error.message
    });
  }
});

export default router;