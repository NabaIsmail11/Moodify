import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styling/recommendations.css';

const Recommendations = () => {
  const { mood } = useParams(); // <-- Grab the mood from URL
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded mood-based song recommendations with unique cover images
  const moodSongs = {
    happy: [
      { id: 1, title: "Don't Stop Me Now", artist: "Queen", duration: "3:29", cover: "https://i.scdn.co/image/ab67616d0000b273e319baafd16e84f0408af2a0", preview: "" },
      { id: 2, title: "Happy", artist: "Pharrell Williams", duration: "3:53", cover: "https://i.scdn.co/image/ab67616d0000b2734c95ce0d7638f5f4dc868c7c", preview: "" },
      { id: 3, title: "Walking on Sunshine", artist: "Katrina and The Waves", duration: "3:43", cover: "https://i.scdn.co/image/ab67616d0000b273a72f316c0984e6b7812463a4", preview: "" }
    ],
    sad: [
      { id: 4, title: "Someone Like You", artist: "Adele", duration: "4:45", cover: "https://i.scdn.co/image/ab67616d0000b2732118bf9b198b05a95ded6300", preview: "" },
      { id: 5, title: "Hurt", artist: "Johnny Cash", duration: "3:38", cover: "https://i.scdn.co/image/ab67616d0000b273e6c980969b73c62c53af5e48", preview: "" },
      { id: 6, title: "Everybody Hurts", artist: "R.E.M.", duration: "5:20", cover: "https://i.scdn.co/image/ab67616d0000b2737d664560be0e574ee7f53d0c", preview: "" }
    ],
    energetic: [
      { id: 7, title: "Eye of the Tiger", artist: "Survivor", duration: "4:05", cover: "https://i.scdn.co/image/ab67616d0000b273b1e0199471707c0f12ce64a9", preview: "" },
      { id: 8, title: "Thunderstruck", artist: "AC/DC", duration: "4:52", cover: "https://i.scdn.co/image/ab67616d0000b273a0e602ee3f6179f6a70d5f2f", preview: "" },
      { id: 9, title: "Lose Yourself", artist: "Eminem", duration: "5:26", cover: "https://i.scdn.co/image/ab67616d0000b273cb66bcc14c6f857c127d5969", preview: "" }
    ],
    calm: [
      { id: 10, title: "Weightless", artist: "Marconi Union", duration: "8:59", cover: "https://i.scdn.co/image/ab67616d0000b273cbf760ab7b0f3887181c377c", preview: "" },
      { id: 11, title: "Clair de Lune", artist: "Claude Debussy", duration: "5:04", cover: "https://i.scdn.co/image/ab67616d0000b273a0b2048383da744a89615367", preview: "" },
      { id: 12, title: "Ocean Eyes", artist: "Billie Eilish", duration: "3:20", cover: "https://i.scdn.co/image/ab67616d0000b273e6f407c7f3a0ec98845e4431", preview: "" }
    ],
    romantic: [
      { id: 13, title: "All of Me", artist: "John Legend", duration: "4:30", cover: "https://i.scdn.co/image/ab67616d0000b273733e2837b42246bc6dddd63b", preview: "" },
      { id: 14, title: "Perfect", artist: "Ed Sheeran", duration: "4:23", cover: "https://i.scdn.co/image/ab67616d0000b2736b44ad40fec1c4573e634fee", preview: "" },
      { id: 15, title: "Can't Help Falling In Love", artist: "Elvis Presley", duration: "3:00", cover: "https://i.scdn.co/image/ab67616d0000b27378d1b5889d9a84ca0a7f7938", preview: "" }
    ],
    focus: [
      { id: 16, title: "Lo-Fi Beats", artist: "Chillhop Music", duration: "3:22", cover: "https://i.scdn.co/image/ab67616d0000b2734e5afb82523e816116927328", preview: "" },
      { id: 17, title: "Rain Sounds", artist: "Nature Noise", duration: "4:10", cover: "https://i.scdn.co/image/ab67616d0000b2735f7a0a200e7ec1fe67af3874", preview: "" },
      { id: 18, title: "Brain Food", artist: "Spotify", duration: "3:40", cover: "https://i.scdn.co/image/ab67616d0000b27335ca35166aba974dd2dd29a2", preview: "" }
    ]
  };

  useEffect(() => {
    const lowerMood = mood?.toLowerCase();
    const moodData = moodSongs[lowerMood];

    if (moodData) {
      setRecommendations(moodData);
    } else {
      setRecommendations([]);
    }
    setIsLoading(false);
  }, [mood]);

  const handleBack = () => {
    navigate('/dashboard');
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
      ) : (
        <div className="recommendations-list">
          {recommendations.length > 0 ? (
            recommendations.map((song) => (
              <div key={song.id} className="song-card">
                <img src={song.cover} alt={`${song.title} by ${song.artist}`} />
                <div className="play-button">
                  <span className="play-icon">▶</span>
                </div>
                <div className="song-info">
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                  <span>{song.duration}</span>
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
    </div>
  );
};

export default Recommendations