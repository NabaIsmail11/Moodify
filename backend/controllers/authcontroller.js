import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

// Environment variables should be in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_LIFETIME = process.env.JWT_LIFETIME || '30d';

// Create JWT token
const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_LIFETIME }
  );
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }
    
    // Create user
    const user = await User.create({ name, email, password });
    
    // Generate token
    const token = createToken(user);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      },
      token
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = createToken(user);
    
    res.status(StatusCodes.OK).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      },
      token
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get current logged in user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};


export const forgotPassword = async (req, res) => {
  res.status(StatusCodes.OK).json({ 
    success: true, 
    message: 'Password reset link sent to your email' 
  });
};

// Reset password (implement in the future)
export const resetPassword = async (req, res) => {
  res.status(StatusCodes.OK).json({ 
    success: true, 
    message: 'Password has been reset successfully' 
  });
};

// Add default export
export default {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword
};
