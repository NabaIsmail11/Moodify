// routes/moods.js
import express from 'express';
import {
  getAllMoods,
  getSongsByMood
} from '../controllers/moodController.js';

const router = express.Router();

// Get all moods
router.get('/', getAllMoods);

// Get songs by mood
router.get('/:mood', getSongsByMood);

export default router;