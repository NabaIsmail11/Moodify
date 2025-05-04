import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class LastFmAPI {
  constructor() {
    this.baseURL = 'https://ws.audioscrobbler.com/2.0/';
    this.apiKey = process.env.LASTFM_API_KEY;
    
    if (!this.apiKey) {
      console.error('LastFM API key is missing. Please set LASTFM_API_KEY in your .env file');
    }
    
    this.cache = {};
    this.cacheExpiry = 3600000; // 1 hour in milliseconds
  }

  // Helper method for making Last.fm API calls
  async makeRequest(method, params = {}) {
    try {
      const cacheKey = `${method}_${JSON.stringify(params)}`;
      
      if (
        this.cache[cacheKey] &&
        this.cache[cacheKey].timestamp > Date.now() - this.cacheExpiry
      ) {
        console.log(`Using cached result for ${method}`);
        return this.cache[cacheKey].data;
      }
      
      const response = await axios.get(this.baseURL, {
        params: {
          method,
          api_key: this.apiKey,
          format: 'json',
          ...params
        }
      });
      
      this.cache[cacheKey] = {
        timestamp: Date.now(),
        data: response.data
      };
      
      return response.data;
    } catch (error) {
      console.error(`LastFM API Error (${method}):`, error.message);
      throw new Error(`LastFM API Error: ${error.message}`);
    }
  }

  async getTrackInfo(track, artist) {
    try {
      const data = await this.makeRequest('track.getInfo', { track, artist });
      
      // Format the response
      if (data.track) {
        return {
          id: `lastfm_${data.track.name}_${data.track.artist.name}`.replace(/\s+/g, '_'),
          title: data.track.name,
          artist: data.track.artist.name,
          album: data.track.album?.title || '',
          coverUrl: data.track.album?.image?.[3]?.['#text'] || '',
          duration: data.track.duration ? this.formatDuration(data.track.duration) : '0:00',
          listeners: data.track.listeners || 0,
          playcount: data.track.playcount || 0,
          url: data.track.url || '',
          mood: this.guessMoodFromTags(data.track.toptags?.tag || [])
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error in getTrackInfo:', error.message);
      return null;
    }
  }

  // Search for tracks by query
  async searchTracks(query, limit = 10) {
    try {
      const data = await this.makeRequest('track.search', { track: query, limit });
      
      if (data.results?.trackmatches?.track) {
        return data.results.trackmatches.track.map(track => ({
          id: `lastfm_${track.name}_${track.artist}`.replace(/\s+/g, '_'),
          title: track.name,
          artist: track.artist,
          coverUrl: track.image?.[2]?.['#text'] || '',
          listeners: track.listeners || 0,
          url: track.url || ''
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error in searchTracks:', error.message);
      return [];
    }
  }

  // Get similar tracks
  async getSimilarTracks(track, artist, limit = 10) {
    try {
      const data = await this.makeRequest('track.getSimilar', { track, artist, limit });
      
      if (data.similartracks?.track) {
        return data.similartracks.track.map(track => ({
          id: `lastfm_${track.name}_${track.artist.name}`.replace(/\s+/g, '_'),
          title: track.name,
          artist: track.artist.name,
          coverUrl: track.image?.[2]?.['#text'] || '',
          match: track.match || 0,
          url: track.url || ''
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error in getSimilarTracks:', error.message);
      return [];
    }
  }

  // Get top tracks by tag (mood)
  async getTracksByMood(mood, limit = 20) {
    try {
      const data = await this.makeRequest('tag.getTopTracks', { tag: mood, limit });
      
      if (data.tracks?.track) {
        return data.tracks.track.map(track => ({
          id: `lastfm_${track.name}_${track.artist.name}`.replace(/\s+/g, '_'),
          title: track.name,
          artist: track.artist.name,
          coverUrl: this.getBestImage(track.image),
          mood: mood.charAt(0).toUpperCase() + mood.slice(1),
          url: track.url || '',
          duration: track.duration ? this.formatDuration(track.duration) : null
        }));
      }
      
      return [];
    } catch (error) {
      console.error(`Error in getTracksByMood (${mood}):`, error.message);
      // Return an empty array instead of throwing an error
      return [];
    }
  }
  
  // Helper to get the best available image
  getBestImage(images) {
    if (!images || !Array.isArray(images)) {
      return '';
    }
    
    if (images[3] && images[3]['#text']) {
      return images[3]['#text'];
    }
    
    if (images[2] && images[2]['#text']) {
      return images[2]['#text'];
    }
    
    for (const img of images) {
      if (img && img['#text']) {
        return img['#text'];
      }
    }
    
    return '';
  }
  
  formatDuration(ms) {
    if (!ms) return '0:00';
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Helper to guess mood from tags
  guessMoodFromTags(tags) {
    // Create a simple mapping between common tags and moods
    const tagToMood = {
      'happy': 'Happy',
      'feel good': 'Happy',
      'upbeat': 'Happy',
      'cheerful': 'Happy',
      'sad': 'Sad',
      'melancholy': 'Sad',
      'emotional': 'Sad',
      'tearjerker': 'Sad',
      'energetic': 'Energetic',
      'power': 'Energetic',
      'workout': 'Energetic',
      'hype': 'Energetic',
      'calm': 'Calm',
      'chill': 'Calm',
      'relaxing': 'Calm',
      'peaceful': 'Calm',
      'romantic': 'Romantic',
      'love': 'Romantic',
      'sensual': 'Romantic',
      'passion': 'Romantic',
      'focus': 'Focus',
      'study': 'Focus',
      'concentration': 'Focus',
      'productivity': 'Focus',
      'angry': 'Angry',
      'rage': 'Angry',
      'metal': 'Angry',
      'intense': 'Angry'
    };
    
    // Check if any of the track's tags match our mood categories
    for (const tag of tags) {
      const tagName = tag.name.toLowerCase();
      if (tagToMood[tagName]) {
        return tagToMood[tagName];
      }
    }
    
    // Default mood if no match found
    return 'Energetic';
  }
}

export default new LastFmAPI();