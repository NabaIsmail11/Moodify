import { StatusCodes } from 'http-status-codes';
import Mood from '../models/Mood.js';
import LastFmAPI from '../utils/lastfmAPI.js';
import DeezerAPI from '../utils/deezerAPI.js';

const recommendationsCache = {};
const CACHE_EXPIRY = 3600000; // 1 hour

export const getAllMoods = async (req, res) => {
  try {
    console.log('Fetching all moods');
    
    // Get moods from database
    let moods = await Mood.find({});
    
    // If no moods in database, create default ones
    if (moods.length === 0) {
      const defaultMoods = [
        {
          name: 'Happy',
          description: 'Uplifting and cheerful songs to boost your mood',
          color: '#f8ff00',
          gradient: 'linear-gradient(135deg, #f8ff00, #ff9500)',
          tags: ['cheerful', 'upbeat', 'positive', 'happy', 'feel good']
        },
        {
          name: 'Sad',
          description: 'Emotional and reflective tracks for when you are feeling blue',
          color: '#0396FF',
          gradient: 'linear-gradient(135deg, #0396FF, #0D47A1)',
          tags: ['melancholy', 'emotional', 'reflective', 'sad', 'tearjerker']
        },
        {
          name: 'Energetic',
          description: 'High-energy songs to get you moving and motivated',
          color: '#FF512F',
          gradient: 'linear-gradient(135deg, #FF512F, #DD2476)',
          tags: ['upbeat', 'workout', 'dance', 'energetic', 'power', 'hype']
        },
        {
          name: 'Calm',
          description: 'Peaceful and relaxing music to help you unwind',
          color: '#1FA2FF',
          gradient: 'linear-gradient(135deg, #1FA2FF, #12D8FA, #A6FFCB)',
          tags: ['relaxing', 'peaceful', 'chill', 'calm']
        },
        {
          name: 'Romantic',
          description: 'Love songs and passionate melodies for romantic moments',
          color: '#F857A6',
          gradient: 'linear-gradient(135deg, #F857A6, #FF5858)',
          tags: ['love', 'passion', 'romance', 'romantic', 'sensual']
        },
        {
          name: 'Focus',
          description: 'Concentration-enhancing tracks for work or study',
          color: '#603813',
          gradient: 'linear-gradient(135deg, #603813, #b29f94)',
          tags: ['concentration', 'study', 'productivity', 'focus']
        },
        {
          name: 'Angry',
          description: 'Intense tracks for releasing frustration',
          color: '#8B0000',
          gradient: 'linear-gradient(135deg, #8B0000, #FF0000)',
          tags: ['angry', 'rage', 'metal', 'intense']
        }
      ];
      
      try {
        moods = await Mood.insertMany(defaultMoods);
        console.log('Created default moods');
      } catch (insertError) {
        console.error('Error creating default moods:', insertError);
        return res.status(StatusCodes.OK).json(defaultMoods);
      }
    }
    
    return res.status(StatusCodes.OK).json(moods);
  } catch (error) {
    console.error('Error in getAllMoods:', error);
    
    // Provide a fallback response with default moods
    const fallbackMoods = [
      {
        _id: 'default_1',
        name: 'Happy',
        description: 'Uplifting and cheerful songs to boost your mood',
        color: '#f8ff00',
        gradient: 'linear-gradient(135deg, #f8ff00, #ff9500)',
        tags: ['cheerful', 'upbeat', 'positive', 'happy', 'feel good']
      },
      {
        _id: 'default_2',
        name: 'Sad',
        description: 'Emotional and reflective tracks for when you are feeling blue',
        color: '#0396FF',
        gradient: 'linear-gradient(135deg, #0396FF, #0D47A1)',
        tags: ['melancholy', 'emotional', 'reflective', 'sad', 'tearjerker']
      },
      {
        _id: 'default_3',
        name: 'Energetic',
        description: 'High-energy songs to get you moving and motivated',
        color: '#FF512F',
        gradient: 'linear-gradient(135deg, #FF512F, #DD2476)',
        tags: ['upbeat', 'workout', 'dance', 'energetic', 'power', 'hype']
      },
      {
        _id: 'default_4',
        name: 'Calm',
        description: 'Peaceful and relaxing music to help you unwind',
        color: '#1FA2FF',
        gradient: 'linear-gradient(135deg, #1FA2FF, #12D8FA, #A6FFCB)',
        tags: ['relaxing', 'peaceful', 'chill', 'calm']
      },
      {
        _id: 'default_5',
        name: 'Romantic',
        description: 'Love songs and passionate melodies for romantic moments',
        color: '#F857A6',
        gradient: 'linear-gradient(135deg, #F857A6, #FF5858)',
        tags: ['love', 'passion', 'romance', 'romantic', 'sensual']
      },
      {
        _id: 'default_6',
        name: 'Focus',
        description: 'Concentration-enhancing tracks for work or study',
        color: '#603813',
        gradient: 'linear-gradient(135deg, #603813, #b29f94)',
        tags: ['concentration', 'study', 'productivity', 'focus']
      },
      {
        _id: 'default_7',
        name: 'Angry',
        description: 'Intense tracks for releasing frustration',
        color: '#8B0000',
        gradient: 'linear-gradient(135deg, #8B0000, #FF0000)',
        tags: ['angry', 'rage', 'metal', 'intense']
      }
    ];
    
    return res.status(StatusCodes.OK).json(fallbackMoods);
  }
};

// Get songs by mood
export const getSongsByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    
    if (!mood) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Mood parameter is required'
      });
    }

    // Check cache first
    const cacheKey = `mood_${mood.toLowerCase()}`;
    if (
      recommendationsCache[cacheKey] &&
      recommendationsCache[cacheKey].timestamp > Date.now() - CACHE_EXPIRY
    ) {
      console.log(`Using cached songs for mood: ${mood}`);
      return res.status(StatusCodes.OK).json({
        success: true,
        mood,
        songs: recommendationsCache[cacheKey].songs
      });
    }
    
    // Find the mood in database to get tags
    const moodDoc = await Mood.findOne({ name: new RegExp(mood, 'i') });
    let tags = ['energetic']; // Default tag

    if (moodDoc && Array.isArray(moodDoc.tags) && moodDoc.tags.length > 0) {
      tags = moodDoc.tags;
    }
    
    // Get songs from LastFM for each tag
    let lastFmSongs = [];
    for (const tag of tags) {
      try {
        const tagSongs = await LastFmAPI.getTracksByMood(tag, 10);
        if (Array.isArray(tagSongs)) {
          lastFmSongs.push(...tagSongs);
        }
      } catch (tagError) {
        console.error(`Error fetching songs for tag '${tag}':`, tagError);
      }
    }
    
    // Remove duplicates
    const uniqueLastFmSongs = Array.from(
      new Map(lastFmSongs.map(song => [`${song.title}_${song.artist}`, song])).values()
    );
    
    // Shuffle and limit to 20 songs
    const shuffledLastFmSongs = uniqueLastFmSongs
      .sort(() => 0.5 - Math.random())
      .slice(0, 20);
    
    const enrichedSongs = await Promise.all(
      shuffledLastFmSongs.map(async (lastFmSong) => {
        try {
          // Search for the song on Deezer
          const searchQuery = `${lastFmSong.title} ${lastFmSong.artist}`;
          const deezerResults = await DeezerAPI.searchTracks(searchQuery, 1);
          
          if (deezerResults && deezerResults.length > 0) {
            const deezerSong = deezerResults[0];
            
            // Merge LastFM and Deezer data, preferring Deezer where available
            return {
              id: deezerSong.id || lastFmSong.id,
              title: lastFmSong.title,
              artist: lastFmSong.artist,
              coverUrl: deezerSong.coverUrl || lastFmSong.coverUrl,
              duration: deezerSong.duration || lastFmSong.duration,
              preview: deezerSong.preview || null,
              deezerLink: deezerSong.deezerLink || null,
              mood: lastFmSong.mood || mood
            };
          }
          
          // If no Deezer match found, return original LastFM data
          return {
            ...lastFmSong,
            preview: null,
            deezerLink: null
          };
        } catch (songError) {
          console.error(`Error enriching song ${lastFmSong.title}:`, songError);
          return lastFmSong;
        }
      })
    );
    
    // Cache the results
    recommendationsCache[cacheKey] = {
      timestamp: Date.now(),
      songs: enrichedSongs
    };
    
    return res.status(StatusCodes.OK).json({
      success: true,
      mood,
      songs: enrichedSongs
    });
  } catch (error) {
    console.error(`Error in getSongsByMood for mood ${req.params.mood}:`, error);
    
    // Return a fallback response instead of error
    return res.status(StatusCodes.OK).json({
      success: true,
      mood: req.params.mood,
      songs: [
        {
          id: `fallback_1_${req.params.mood}`,
          title: 'Fallback Song 1',
          artist: 'Various Artists',
          coverUrl: 'https://i.scdn.co/image/ab67706f00000002261b4231fdb64c7adbdd7d1c',
          mood: req.params.mood.charAt(0).toUpperCase() + req.params.mood.slice(1),
          preview: null,
          deezerLink: null
        },
        {
          id: `fallback_2_${req.params.mood}`,
          title: 'Fallback Song 2',
          artist: 'Top Artists',
          coverUrl: 'https://i.scdn.co/image/ab67616d0000b273762d1d1d540c6b98693354fd',
          mood: req.params.mood.charAt(0).toUpperCase() + req.params.mood.slice(1),
          preview: null,
          deezerLink: null
        }
      ]
    });
  }
};

export default {
  getAllMoods,
  getSongsByMood
};