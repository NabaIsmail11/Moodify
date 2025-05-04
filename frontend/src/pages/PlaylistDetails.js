import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AudioPlayer from '../components/AudioPlayer';
import '../styling/PlaylistDetails.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  
  useEffect(() => {
    const fetchPlaylist = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if ID is defined and valid
        if (!id || id === 'undefined') {
          throw new Error('Invalid playlist ID');
        }
        
        // Make sure we're using the correct API endpoint
        console.log(`Fetching playlist with ID: ${id}`);
        const response = await axios.get(`${API_URL}/playlists/${id}`);
        
        if (response.data) {
          console.log('Playlist data received:', response.data);
          setPlaylist(response.data);
          
          // Ensure we have songs array, even if empty
          setSongs(response.data.songs || []);
        } else {
          throw new Error('No playlist data received');
        }
      } catch (err) {
        console.error('Error fetching playlist details:', err);
        setError('Failed to load playlist. Please try again later.');
        
        // Fallback data
        setPlaylist({
          title: "Playlist Not Found",
          description: "We couldn't load this playlist right now.",
          coverUrl: "/api/placeholder/300/300",
          songCount: 0
        });
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if we have an ID
    if (id) {
      fetchPlaylist();
    } else {
      // Handle case when no ID is provided
      setError('No playlist selected');
      setIsLoading(false);
      setPlaylist({
        title: "No Playlist Selected",
        description: "Please select a valid playlist to view.",
        coverUrl: "/api/placeholder/300/300",
        songCount: 0
      });
    }
  }, [id]);
  
  const playSong = (song) => {
    setCurrentSong(song);
  };
  
  const closePlayer = () => {
    setCurrentSong(null);
  };
  
  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="playlist-detail-container">
        <div className="loading-container">
          <h2>Loading playlist...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="playlist-detail-container">
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
          <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Show empty state if no playlist is loaded
  if (!playlist) {
    return (
      <div className="playlist-detail-container">
        <div className="error-container">
          <h2>No Playlist Found</h2>
          <p>We couldn't find the playlist you're looking for.</p>
          <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-detail-container">
      <div className="playlist-header">
        <Link to="/dashboard" className="back-button">
          ← Back
        </Link>
        
        <div className="playlist-header-content">
          <div className="playlist-cover">
            <img 
              src={playlist.coverUrl || '/api/placeholder/300/300'} 
              alt={playlist.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/api/placeholder/300/300';
              }}
            />
          </div>
          
          <div className="playlist-info">
            <span className="playlist-label">PLAYLIST</span>
            <h1>{playlist.title}</h1>
            <p className="playlist-description">{playlist.description}</p>
            <div className="playlist-stats">
              <span>{songs.length} songs</span>
              {playlist.duration && (
                <span>• {Math.floor(playlist.duration / 60)} min</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="playlist-songs">
        <div className="songs-header">
          <div className="song-number">#</div>
          <div className="song-title">Title</div>
          <div className="song-album">Album</div>
          <div className="song-duration">Duration</div>
        </div>
        
        {songs.length > 0 ? (
          <div className="songs-list">
            {songs.map((song, index) => (
              <div 
                key={song.id || song._id || index} 
                className="song-item"
                onClick={() => playSong(song)}
              >
                <div className="song-number">{index + 1}</div>
                <div className="song-title">
                  <div className="song-image">
                    <img 
                      src={song.coverUrl || '/api/placeholder/40/40'} 
                      alt={song.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/api/placeholder/40/40';
                      }}
                    />
                  </div>
                  <div className="song-info">
                    <span className="song-name">{song.title}</span>
                    <span className="song-artist">{song.artist}</span>
                  </div>
                </div>
                <div className="song-album">{song.album || '-'}</div>
                <div className="song-duration">{formatDuration(song.duration)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-playlist">
            <p>No songs in this playlist</p>
          </div>
        )}
      </div>
      
      {currentSong && (
        <AudioPlayer 
          song={currentSong}
          onClose={closePlayer}
        />
      )}
    </div>
  );
};

export default PlaylistDetail;