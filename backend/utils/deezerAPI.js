// utils/deezerApi.js
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class DeezerAPI {
  constructor() {
    this.baseURL = 'https://api.deezer.com';
    // Deezer API typically doesn't require an API key for many endpoints
  }

  // Helper method for making Deezer API calls
  async makeRequest(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: {
          ...params
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Deezer API Error (${endpoint}):`, error.message);
      throw error;
    }
  }
  // Add this method to utils/deezerApi.js class

// Get popular songs
  async getPopularSongs(limit = 10) {
    try {
    // Deezer doesn't have a direct 'popular songs' endpoint, but we can use the charts
      const data = await this.makeRequest('/chart/0/tracks', { limit });
    
      if (data && data.data) {
        return data.data.map(track => ({
          id: `deezer_${track.id}`,
          title: track.title,
          artist: track.artist ? track.artist.name : 'Unknown Artist',
          album: track.album ? track.album.title : 'Unknown Album',
          coverUrl: track.album && track.album.cover_medium ? track.album.cover_medium : '',
          duration: track.duration || 0,
          preview: track.preview || '', // This is the preview URL we'll use for playback
          deezerLink: track.link || '',
            // Add additional artist info
          artistId: track.artist ? track.artist.id : null,
          artistPicture: track.artist && track.artist.picture_medium ? track.artist.picture_medium : '',
        }));
      }
    
      return [];
    } catch (error) {
      console.error('Error in getPopularSongs:', error.message);
      throw error;
    }
  }

// Add a method to get song details by ID if needed
  async getSongDetails(songId) {
    try {
    // Extract the actual Deezer ID if it has our prefix
      const actualId = songId.startsWith('deezer_') ? songId.replace('deezer_', '') : songId;
    
      const data = await this.makeRequest(`/track/${actualId}`);
    
      if (data) {
        return {
          id: `deezer_${data.id}`,
          title: data.title,
          artist: data.artist ? data.artist.name : 'Unknown Artist',
          album: data.album ? data.album.title : 'Unknown Album',
          coverUrl: data.album && data.album.cover_medium ? data.album.cover_medium : '',
          duration: data.duration || 0,
          preview: data.preview || '',
          deezerLink: data.link || '',
          artistId: data.artist ? data.artist.id : null,
          artistPicture: data.artist && data.artist.picture_medium ? data.artist.picture_medium : '',
        };
      }
    
      return null;
    } catch (error) {
      console.error(`Error in getSongDetails for id ${songId}:`, error.message);
      return null;
    }
  } 
  // Get popular playlists
  async getPopularPlaylists(limit = 6) {
    try {
      // Using charts endpoint to get popular playlists
      const data = await this.makeRequest('/chart/0/playlists', { limit });
      
      if (data && data.data) {
        return data.data.map(playlist => ({
          title: playlist.title,
          description: playlist.description || `${playlist.title} - A popular playlist on Deezer`,
          coverUrl: playlist.picture_big || playlist.picture_medium || playlist.picture,
          songCount: playlist.nb_tracks || 0,
          deezerId: playlist.id
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error in getPopularPlaylists:', error.message);
      throw error;
    }
  }

  // Get playlist details including tracks
  async getPlaylistDetails(playlistId) {
    try {
      const data = await this.makeRequest(`/playlist/${playlistId}`);
      
      if (data) {
        const songs = data.tracks && data.tracks.data ? data.tracks.data.map(track => ({
          id: `deezer_${track.id}`,
          title: track.title,
          artist: track.artist ? track.artist.name : 'Unknown Artist',
          album: track.album ? track.album.title : 'Unknown Album',
          coverUrl: track.album && track.album.cover_medium ? track.album.cover_medium : '',
          duration: track.duration || 0,
          preview: track.preview || '',
          deezerLink: track.link || ''
        })) : [];
        
        return {
          id: data.id,
          title: data.title,
          description: data.description || `${data.title} - A playlist on Deezer`,
          coverUrl: data.picture_big || data.picture_medium || data.picture,
          songCount: data.nb_tracks || 0,
          songs
        };
      }
      
      return { songs: [] };
    } catch (error) {
      console.error(`Error in getPlaylistDetails for id ${playlistId}:`, error.message);
      
      // Return an empty result rather than throwing
      return { songs: [] };
    }
  }

  // Search for tracks
  async searchTracks(query, limit = 10) {
    try {
      const data = await this.makeRequest('/search', { q: query, limit });
      
      if (data && data.data) {
        return data.data.map(track => ({
          id: `deezer_${track.id}`,
          title: track.title,
          artist: track.artist ? track.artist.name : 'Unknown Artist',
          album: track.album ? track.album.title : 'Unknown Album',
          coverUrl: track.album && track.album.cover_medium ? track.album.cover_medium : '',
          duration: track.duration || 0,
          preview: track.preview || '',
          deezerLink: track.link || '' 
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error in searchTracks:', error.message);
      return [];
    }
  }

  // Get artist's top tracks
  async getArtistTopTracks(artistId, limit = 10) {
    try {
      const data = await this.makeRequest(`/artist/${artistId}/top`, { limit });
      
      if (data && data.data) {
        return data.data.map(track => ({
          id: `deezer_${track.id}`,
          title: track.title,
          artist: track.artist ? track.artist.name : 'Unknown Artist',
          album: track.album ? track.album.title : 'Unknown Album',
          coverUrl: track.album && track.album.cover_medium ? track.album.cover_medium : '',
          duration: track.duration || 0,
          preview: track.preview || ''
        }));
      }
      
      return [];
    } catch (error) {
      console.error(`Error in getArtistTopTracks for id ${artistId}:`, error.message);
      return [];
    }
  }
}

export default new DeezerAPI();