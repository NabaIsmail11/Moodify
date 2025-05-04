import { StatusCodes } from 'http-status-codes';
import LastFmAPI from '../utils/lastfmAPI.js';
import DeezerAPI from '../utils/deezerAPI.js';
import Song from '../models/Song.js';
import UserSongHistory from '../models/UserSongHistory.js';

// Get popular songs
export const getPopularSongs = async (req, res) => {
  try {
    console.log('Fetching popular songs');
    
    // First try to get popular songs from Deezer
    let songs = [];
    try {
      songs = await DeezerAPI.getPopularSongs(10);
    } catch (deezerError) {
      console.error('Error fetching from Deezer:', deezerError);
      
      // Fallback to LastFM for popular songs by happy mood
      try {
        songs = await LastFmAPI.getTracksByMood('happy', 10);
      } catch (lastFmError) {
        console.error('Error fetching from LastFM:', lastFmError);
        // If both APIs fail, throw an error
        throw new Error('Failed to fetch popular songs from any music API');
      }
    }
    
    return res.status(StatusCodes.OK).json(songs);
  } catch (error) {
    console.error('Error in getPopularSongs:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch popular songs',
      error: error.message
    });
  }
};

// Get recently played songs
export const getRecentSongs = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find user's recently played songs
    const recentSongs = await UserSongHistory.find({ user: userId })
      .sort({ playedAt: -1 })
      .limit(10)
      .populate('song');
    
    // Format the songs data
    const formattedSongs = recentSongs.map(history => {
      const song = history.song;
      return {
        id: song._id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        coverUrl: song.coverUrl,
        mood: song.mood,
        playedAt: history.playedAt
      };
    });
    
    return res.status(StatusCodes.OK).json(formattedSongs);
  } catch (error) {
    console.error('Error in getRecentSongs:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch recently played songs',
      error: error.message
    });
  }
};

// Record a song play
export const recordPlay = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { songId } = req.params;
    
    // Find the song or create it if it doesn't exist
    let song = await Song.findById(songId);
    
    if (!song) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Song not found'
      });
    }
    
    // Create a new play record
    const playRecord = new UserSongHistory({
      user: userId,
      song: songId,
      playedAt: new Date()
    });
    
    await playRecord.save();
    
    // Update the song's play count
    song.playCount = (song.playCount || 0) + 1;
    await song.save();
    
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Play recorded successfully'
    });
  } catch (error) {
    console.error('Error in recordPlay:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to record play',
      error: error.message
    });
  }
};

// Search for songs
export const searchSongs = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    // First try Deezer search
    let results = [];
    try {
      results = await DeezerAPI.searchSongs(query, 10);
    } catch (deezerError) {
      console.error('Error searching in Deezer:', deezerError);
      
      // Fallback to LastFM search
      try {
        results = await LastFmAPI.searchTracks(query, 10);
      } catch (lastFmError) {
        console.error('Error searching in LastFM:', lastFmError);
        throw new Error('Failed to search songs from any music API');
      }
    }
    
    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    console.error('Error in searchSongs:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to search for songs',
      error: error.message
    });
  }
};

export default {
  getPopularSongs,
  getRecentSongs,
  recordPlay,
  searchSongs
};