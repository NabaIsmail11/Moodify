import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';

const Recommendations = () => {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded mood-based song recommendations
  const moodSongs = {
    happy: [
      { id: 1, title: "Don't Stop Me Now", artist: "Queen", duration: "3:29", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" },
      { id: 2, title: "Happy", artist: "Pharrell Williams", duration: "3:53", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" },
      { id: 3, title: "Walking on Sunshine", artist: "Katrina and The Waves", duration: "3:43", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" }
    ],
    sad: [
      { id: 4, title: "Someone Like You", artist: "Adele", duration: "4:45", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" },
      { id: 5, title: "Hurt", artist: "Johnny Cash", duration: "3:38", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" },
      { id: 6, title: "Everybody Hurts", artist: "R.E.M.", duration: "5:20", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" }
    ],
    energetic: [
      { id: 7, title: "Eye of the Tiger", artist: "Survivor", duration: "4:05", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" },
      { id: 8, title: "Thunderstruck", artist: "AC/DC", duration: "4:52", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" },
      { id: 9, title: "Lose Yourself", artist: "Eminem", duration: "5:26", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" }
    ],
    calm: [
      { id: 10, title: "Weightless", artist: "Marconi Union", duration: "8:59", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" },
      { id: 11, title: "Clair de Lune", artist: "Claude Debussy", duration: "5:04", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" },
      { id: 12, title: "River Flows In You", artist: "Yiruma", duration: "3:10", cover: "https://i.scdn.co/image/ab67616d0000b2734ce8b4e42588bf18182a1ad2", preview: "https://p.scdn.co/mp3-preview/1d1d7a5f9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9" }
    ]
  };

  useEffect(() => {
    const loadRecommendations = () => {
      const moodData = JSON.parse(localStorage.getItem('selectedMood'));
      if (moodData) {
        setCurrentMood(moodData);
        // Get songs based on mood from our hardcoded list
        const recs = moodSongs[moodData.name.toLowerCase()] || [];
        setRecommendations(recs);
        setIsLoading(false);
      } else {
        navigate('/select-mood');
      }
    };

    // Simulate loading delay
    setTimeout(loadRecommendations, 1000);
  }, [navigate]);

  return (
    <Layout 
      title={currentMood ? `${currentMood.name} Recommendations` : "Your Recommendations"}
      showNav={true}
    >
      {currentMood && (
        <div style={localStyles.moodHeader}>
          <div style={{ 
            ...localStyles.moodIndicator,
            backgroundColor: currentMood.color
          }}>
            <span style={localStyles.moodEmoji}>{currentMood.emoji}</span>
            <span style={localStyles.moodName}>{currentMood.name}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={localStyles.loading}>
          <div style={localStyles.spinner}></div>
          <p>Finding perfect songs for your mood...</p>
        </div>
      ) : (
        <div style={localStyles.recommendations}>
          {recommendations.length > 0 ? (
            recommendations.map(song => (
              <div key={song.id} style={localStyles.songCard}>
                <img 
                  src={song.cover} 
                  alt={`${song.title} cover`} 
                  style={localStyles.coverArt}
                />
                <div style={localStyles.songInfo}>
                  <h3 style={localStyles.songTitle}>{song.title}</h3>
                  <p style={localStyles.songArtist}>{song.artist}</p>
                </div>
                <div style={localStyles.songDuration}>{song.duration}</div>
                {song.preview && (
                  <audio controls style={localStyles.audioPlayer}>
                    <source src={song.preview} type="audio/mp3" />
                  </audio>
                )}
              </div>
            ))
          ) : (
            <div style={localStyles.noResults}>
              <p>No recommendations found for this mood.</p>
              <button 
                style={localStyles.tryAgainButton}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

const localStyles = {
    moodHeader: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    moodIndicator: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderRadius: '30px',
        marginBottom: '15px',
    },
    moodEmoji: {
        fontSize: '24px',
        marginRight: '10px',
    },
    moodName: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: '600',
    },
    recommendations: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    songCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        transition: 'all 0.3s',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            transform: 'translateY(-2px)',
        }
    },
    coverArt: {
        width: '60px',
        height: '60px',
        borderRadius: '4px',
        marginRight: '15px',
        objectFit: 'cover',
    },
    songInfo: {
        flex: 1,
    },
    songTitle: {
        color: '#fff',
        fontSize: '16px',
        margin: '0 0 5px 0',
    },
    songArtist: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        margin: 0,
    },
    songDuration: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '14px',
        margin: '0 15px',
    },
    audioPlayer: {
        width: '150px',
        height: '40px',
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    spinner: {
        border: '4px solid rgba(255, 255, 255, 0.1)',
        borderTop: '4px solid #8e44ad',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        marginBottom: '15px',
    },
    noResults: {
        textAlign: 'center',
        padding: '40px',
        color: 'rgba(255, 255, 255, 0.7)',
    },
    tryAgainButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#8e44ad',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        ':hover': {
            backgroundColor: '#9b59b6',
        }
    }
};

export default Recommendations;