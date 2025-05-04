import express from 'express';
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserProfile,
  updateUserActivity
} from '../controllers/userplaylistcontroller.js';
  import {getFeaturedPlaylists,
  getPlaylistDetails,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getUserPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/playlistController.js';

import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/profile', getUserProfile);
router.post('/activity', updateUserActivity);

router.route('/')
  .post(createPlaylist)
  .get(getUserPlaylists);

router.route('/:id')
  .get(getPlaylistById)
  .put(updatePlaylist)
  .delete(deletePlaylist);

router.post('/:id/songs', addSongToPlaylist);
router.delete('/:id/songs/:songId', removeSongFromPlaylist);

// Public routes
router.get('/featured', getFeaturedPlaylists);

// Route to get user playlists - must come before '/:id' route to avoid conflict
router.get('/user/:userId', authenticateUser, getUserPlaylists);

// Create new playlist
router.post('/', authenticateUser, createPlaylist);

// Routes with playlist ID
router.get('/:id', getPlaylistDetails);
router.put('/:id', authenticateUser, updatePlaylist);
router.delete('/:id', authenticateUser, deletePlaylist);
router.post('/:id/songs', authenticateUser, addSongToPlaylist);
router.delete('/:id/songs/:songId', authenticateUser, removeSongFromPlaylist);

export default router;
