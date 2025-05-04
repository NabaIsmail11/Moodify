import Playlist from '../models/playlist.js';
import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';

// Create a new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { title, description, coverUrl } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const playlist = await Playlist.create({
      title,
      description,
      coverUrl: coverUrl || '/api/placeholder/300/300',
      user: req.user.userId,
      songs: []
    });

    // Update user's playlists array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { playlists: playlist._id } },
      { new: true }
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      playlist
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

// Get all playlists for the current user
export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.userId });
    
    res.status(StatusCodes.OK).json({
      success: true,
      count: playlists.length,
      playlists
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single playlist by ID
export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!playlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      playlist
    });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// Update a playlist
export const updatePlaylist = async (req, res) => {
  try {
    const { title, description, coverUrl } = req.body;
    
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, description, coverUrl, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!playlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    res.status(StatusCodes.OK).json({
      success: true,
      playlist
    });
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
  try {
    // Find the playlist
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!playlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Remove playlist from database
    await Playlist.findByIdAndDelete(req.params.id);
    
    // Also remove the playlist reference from the user document
    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { playlists: req.params.id } },
      { new: true }
    );
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};
// Add a song to a playlist
export const addSongToPlaylist = async (req, res) => {
  try {
    const { title, artist, coverUrl, url, duration } = req.body;
    
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!playlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Add the song to the playlist
    playlist.songs.push({
      title,
      artist,
      coverUrl,
      url,
      duration: duration || '0:00'
    });
    
    playlist.updatedAt = Date.now();
    await playlist.save();
    
    res.status(StatusCodes.OK).json({
      success: true,
      playlist
    });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

// Remove a song from a playlist
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!playlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Remove the song from the playlist
    playlist.songs = playlist.songs.filter(
      song => song._id.toString() !== req.params.songId
    );
    
    playlist.updatedAt = Date.now();
    await playlist.save();
    
    res.status(StatusCodes.OK).json({
      success: true,
      playlist
    });
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// Get the user profile with activity data
export const getUserProfile = async (req, res) => {
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
    console.error('Error fetching user profile:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

// Update user activity
export const updateUserActivity = async (req, res) => {
  try {
    const { activity } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { recentActivity: activity } },
      { new: true }
    ).select('-password');
    
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
    console.error('Error updating user activity:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};
