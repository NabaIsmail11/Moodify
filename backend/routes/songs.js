// routes/songs.js
import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import {
  getPopularSongs,
  getRecentSongs,
  recordPlay,
  searchSongs
} from '../controllers/songController.js';

const router = express.Router();

// Public routes
router.get('/popular', getPopularSongs);
router.get('/search', searchSongs);

// Protected routes (require login)
router.get('/recent', authenticateUser, getRecentSongs);
router.post('/:songId/play', authenticateUser, recordPlay);

export default router;