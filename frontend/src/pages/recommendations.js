import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styling/recommendations.css';
import AudioPlayer from '../components/AudioPlayer';

const Recommendations = () => {
  const { mood } = useParams(); // Extract mood from URL params
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  
  const fallbackImage = 'https://via.placeholder.com/150'; // Fallback image

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        // Use the API endpoint from moodController
        const response = await axios.get(`/api/moods/${mood}`);
        console.log('API Response:', response.data);

        if (response.data.success) {
          setSongs(response.data.songs);
        } else {
          setError(response.data.message || 'Something went wrong');
        }
      } catch (err) {
        setError('Failed to fetch songs. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (mood) {
      fetchSongs();
    } else {
      setIsLoading(false);
    }
  }, [mood]); // Re-run when mood changes

  const handlePlaySong = (song) => {
    // Only play songs that have a preview URL
    if (song && song.preview) {
      setCurrentSong(song);
    } else {
      // If no preview, we can show a message
      alert(`No preview available for "${song.title}" by ${song.artist}. Try another song.`);
    }
  };

  const handleClosePlayer = () => {
    setCurrentSong(null);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };
  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="recommendations-page">
      <div className="recommendations-header">
        <h1>{mood ? `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes` : "Mood Vibes"}</h1>
        <button onClick={handleBack}>← Back</button>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button className="try-again-button" onClick={handleBack}>Try Another Mood</button>
        </div>
      ) : (
        <div className="recommendations-list">
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <div 
                key={index} 
                className={`song-card ${song.preview ? 'has-preview' : 'no-preview'}`}
                onClick={() => handlePlaySong(song)}
              >
                <img 
                  src={song.coverUrl || fallbackImage} 
                  alt={`${song.title} by ${song.artist}`}
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
                <div className="play-button">
                  <span className="play-icon">{song.preview ? '▶' : '🔇'}</span>
                </div>
                <div className="song-info">
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                  {song.duration&& <span>{formatDuration(song.duration)}</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No songs found for this mood.</p>
              <button className="try-again-button" onClick={handleBack}>Try Another Mood</button>
            </div>
          )}
        </div>
      )}

      {/* Audio Player that appears when a song is selected */}
      {currentSong && (
        <AudioPlayer song={currentSong} onClose={handleClosePlayer} />
      )}
    </div>
  );
};

export default Recommendations;