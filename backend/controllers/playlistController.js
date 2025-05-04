import { StatusCodes } from 'http-status-codes';
import Playlist from '../models/Playlist.js';
import User from '../models/User.js';
import DeezerAPI from '../utils/deezerAPI.js';

export const getFeaturedPlaylists = async (req, res) => {
  try {
    console.log('Fetching featured playlists');
    
    // Try to get playlists from database first
    let playlists = await Playlist.find({ featured: true }).limit(6);
    
    if (playlists.length === 0) {
      try {
        // Get playlists from Deezer API
        const deezerPlaylists = await DeezerAPI.getPopularPlaylists(6);
        
        // Save playlists to database and mark as featured
        const playlistsToSave = deezerPlaylists.map(playlist => ({
          title: playlist.title,
          description: playlist.description,
          coverUrl: playlist.coverUrl,
          songCount: playlist.songCount,
          deezerRef: playlist.deezerId,
          featured: true
        }));
        
        playlists = await Playlist.insertMany(playlistsToSave);
      } catch (apiError) {
        console.error('Error fetching playlists from Deezer:', apiError);
        
        // Create some default playlists if API fails
        const defaultPlaylists = [
          {
            title: "Happy Vibes",
            description: "Songs to boost your mood and make you feel fantastic all day long",
            coverUrl: "https://i.scdn.co/image/ab67706f00000002261b4231fdb64c7adbdd7d1c",
            songCount: 15,
            featured: true
          },
          {
            title: "Chill Mode",
            description: "Perfect for relaxation and unwinding after a long day",
            coverUrl: "https://i.scdn.co/image/ab67616d0000b273762d1d1d540c6b98693354fd",
            songCount: 12,
            featured: true
          },
          {
            title: "Workout Intensity",
            description: "Keep your energy high and push through any workout with these energetic tracks",
            coverUrl: "https://i.scdn.co/image/ab67616d00001e0256da1ee51c2ebfb001c7ef8a",
            songCount: 20,
            featured: true
          },
          {
            title: "Focus Flow",
            description: "Concentrate better with these carefully selected instrumental tracks",
            coverUrl: "https://i1.sndcdn.com/artworks-m5GmzxRYjSNAcqsi-XVbAiA-t500x500.jpg",
            songCount: 18,
            featured: true
          }
        ];
        
        playlists = await Playlist.insertMany(defaultPlaylists);
      }
    }
    
    return res.status(StatusCodes.OK).json(playlists);
  } catch (error) {
    console.error('Error in getFeaturedPlaylists:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch featured playlists',
      error: error.message
    });
  }
};

// Get specific playlist with songs
export const getPlaylistDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Getting playlist details for ID:', id);
    
    // Check if ID is undefined or invalid
    if (!id) {
      console.log('Invalid playlist ID received: empty or undefined');
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid playlist ID'
      });
    }
    
    // First try to find in our database
    let playlist = await Playlist.findById(id);
    
    if (!playlist) {
      console.log(`No playlist found with ID: ${id}`);
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    console.log(`Found playlist: ${playlist.title}, deezerRef: ${playlist.deezerRef}`);
    
    // If playlist has a Deezer reference, get detailed info from there
    let songs = [];
    if (playlist.deezerRef) {
      try {
        console.log(`Fetching songs from Deezer for playlist ${playlist.title} with ID ${playlist.deezerRef}`);
        const deezerPlaylist = await DeezerAPI.getPlaylistDetails(playlist.deezerRef);
        
        // Ensure we're getting back songs
        if (deezerPlaylist && deezerPlaylist.songs) {
          console.log(`Retrieved ${deezerPlaylist.songs.length} songs from Deezer`);
          songs = deezerPlaylist.songs;
        } else {
          console.log('No songs returned from Deezer API');
        }
      } catch (apiError) {
        console.error('Error fetching playlist from Deezer:', apiError);
      }
    } else {
      // If not a Deezer playlist, use the songs from our database
      songs = playlist.songs || [];
      console.log(`Using ${songs.length} songs from database`);
    }
    
    // Prepare response object with all necessary data
    const responsePlaylist = {
      ...playlist.toObject(),
      songs
    };
    
    console.log(`Sending playlist with ${songs.length} songs`);
    return res.status(StatusCodes.OK).json(responsePlaylist);
  } catch (error) {
    console.error('Error in getPlaylistDetails:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch playlist details',
      error: error.message
    });
  }
};

// Create a new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { title, description, coverUrl, isPublic, tags } = req.body;
    
    if (!title) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide a title for the playlist'
      });
    }
    
    const playlist = await Playlist.create({
      title,
      description: description || '',
      coverUrl: coverUrl || '',
      createdBy: req.user.userId,
      isPublic: isPublic !== undefined ? isPublic : true,
      tags: tags || []
    });
    
    return res.status(StatusCodes.CREATED).json({
      success: true,
      playlist
    });
  } catch (error) {
    console.error('Error in createPlaylist:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create playlist',
      error: error.message
    });
  }
};

// Update playlist details
export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, coverUrl, isPublic, tags } = req.body;
    
    // Find playlist and check if user is authorized to update it
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Check if user is the creator of the playlist
    if (playlist.createdBy && playlist.createdBy.toString() !== req.user.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'You are not authorized to update this playlist'
      });
    }
    
    // Update the playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      {
        title: title || playlist.title,
        description: description !== undefined ? description : playlist.description,
        coverUrl: coverUrl || playlist.coverUrl,
        isPublic: isPublic !== undefined ? isPublic : playlist.isPublic,
        tags: tags || playlist.tags,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    return res.status(StatusCodes.OK).json({
      success: true,
      playlist: updatedPlaylist
    });
  } catch (error) {
    console.error('Error in updatePlaylist:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update playlist',
      error: error.message
    });
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find playlist and check if user is authorized to delete it
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Check if user is the creator of the playlist or an admin
    if (playlist.createdBy && playlist.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'You are not authorized to delete this playlist'
      });
    }
    
    // Delete the playlist
    await Playlist.findByIdAndDelete(id);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    console.error('Error in deletePlaylist:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete playlist',
      error: error.message
    });
  }
};

// Get playlists created by a specific user
export const getUserPlaylists = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Find playlists created by this user
    const playlists = await Playlist.find({ createdBy: userId });
    
    return res.status(StatusCodes.OK).json(playlists);
  } catch (error) {
    console.error('Error in getUserPlaylists:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch user playlists',
      error: error.message
    });
  }
};

// Add a song to a playlist
export const addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { song } = req.body;
    
    if (!song || !song.title || !song.artist) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide song details'
      });
    }
    
    // Find playlist and check if user is authorized
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Check if user is the creator of the playlist
    if (playlist.createdBy && playlist.createdBy.toString() !== req.user.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'You are not authorized to modify this playlist'
      });
    }
    
    // Check if song is already in the playlist
    const songExists = playlist.songs.some(s => 
      s.songId === song.songId || 
      (s.title === song.title && s.artist === song.artist)
    );
    
    if (songExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'This song is already in the playlist'
      });
    }
    
    // Add the song to the playlist
    playlist.songs.push({
      songId: song.songId || `local_${Date.now()}`,
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      coverUrl: song.coverUrl || '',
      duration: song.duration || 0,
      preview: song.preview || ''
    });
    
    // Save the updated playlist
    await playlist.save();
    
    return res.status(StatusCodes.OK).json({
      success: true,
      playlist
    });
  } catch (error) {
    console.error('Error in addSongToPlaylist:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to add song to playlist',
      error: error.message
    });
  }
};

// Remove a song from a playlist
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;
    
    // Find playlist and check if user is authorized
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Playlist not found'
      });
    }
    
    // Check if user is the creator of the playlist
    if (playlist.createdBy && playlist.createdBy.toString() !== req.user.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'You are not authorized to modify this playlist'
      });
    }
    
    // Find the song index
    const songIndex = playlist.songs.findIndex(s => s.songId === songId);
    
    if (songIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Song not found in this playlist'
      });
    }
    
    // Remove the song
    playlist.songs.splice(songIndex, 1);
    
    // Save the updated playlist
    await playlist.save();
    
    return res.status(StatusCodes.OK).json({
      success: true,
      playlist
    });
  } catch (error) {
    console.error('Error in removeSongFromPlaylist:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to remove song from playlist',
      error: error.message
    });
  }
};

export default {
  getFeaturedPlaylists,
  getPlaylistDetails,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getUserPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist
};