import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  forgotPassword, 
  resetPassword 
} from '../controllers/authcontroller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateUser, getCurrentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
