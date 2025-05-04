import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate token
export const authenticateUser = async (req, res, next) => {
  // Check for the authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication invalid'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach the user to the request object
    req.user = decoded;
    
    // Check if user still exists
    const userExists = await User.findById(decoded.userId);
    if (!userExists) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User no longer exists'
      });
    }
    
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Middleware to check if user is admin (for future use)
export const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// Export as default object with both middlewares
export default {
  authenticateUser,
  authorizeAdmin
};
