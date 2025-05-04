import React, { useState, useEffect, useRef } from 'react';
import '../styling/AudioPlayer.css';

const AudioPlayer = ({ song, onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract all necessary fields from the song object
  const {
    preview: songUrl,
    title: songTitle,
    artist: artistName,
    coverUrl,
    deezerLink
  } = song || {};

  useEffect(() => {
    // Reset player and start playing when a new song is loaded
    if (audioRef.current && songUrl) {
      setLoading(true);
      setError(null);
      
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
          setLoading(false);
          setError("Preview unavailable");
        });
    }
  }, [songUrl]);

  useEffect(() => {
    // Add event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError("Preview unavailable");
      setLoading(false);
    };

    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (error) return;
    
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.error("Error playing audio:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    if (error) return;
    
    const newProgress = e.target.value;
    const newTime = (duration * newProgress) / 100;
    audioRef.current.currentTime = newTime;
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onClose();
  };
  
  // Open song on Deezer when clicking the title
  const openOnDeezer = () => {
    if (deezerLink) {
      window.open(deezerLink, '_blank');
    }
  };

  return (
    <div className="audio-player">
      <div className="player-content">
        <div className="player-image">
          <img src={coverUrl || '/api/placeholder/80/80'} alt={songTitle} />
        </div>
        
        <div className="player-info">
          <div className="song-details">
            <h4 onClick={openOnDeezer} style={{cursor: deezerLink ? 'pointer' : 'default'}}>
              {songTitle || 'Unknown Track'}
            </h4>
            <p>{artistName || 'Unknown Artist'}</p>
          </div>
          
          <div className="player-controls">
            <button 
              className="control-button" 
              onClick={togglePlayPause}
              disabled={loading || error}
            >
              {loading ? '⏳' : error ? '❌' : isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <div className="progress-container">
              <span className="time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                className="progress-slider"
                onChange={handleProgressChange}
                disabled={loading || error}
              />
              <span className="time">{formatTime(duration)}</span>
            </div>
            
            {error && (
              <span className="preview-error">
                {error} 
                {deezerLink && (
                  <a href={deezerLink} target="_blank" rel="noopener noreferrer" className="deezer-link">
                    Listen on Deezer
                  </a>
                )}
              </span>
            )}
          </div>
        </div>
        
        <button className="close-button" onClick={handleClose}>✕</button>
      </div>
      
      <audio ref={audioRef} src={songUrl}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;