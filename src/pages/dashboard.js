import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styling/Dashboard.css';


const Dashboard = () => {
  // Reference for mood section
  const moodSectionRef = useRef(null);
  const navigate = useNavigate();
  
  // Mock data for popular songs
  const [popularSongs, setPopularSongs] = useState([
    {
      id: 1,
      title: "Happy",
      artist: "Pharrell Williams",
      mood: "Joyful",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F08c9cccbe508d70ae05be9c0e7d05358.1000x1000x1.jpg"
    },
    {
      id: 2,
      title: "Blinding Lights",
      artist: "Weekend",
      mood: "Energetic",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F34c1c35ca27a735e6e5f18611acb1c16.1000x1000x1.png"
    },
    {
      id: 3,
      title: "BIRDS OF A FEATHER",
      artist: "Billie Eilish",
      mood: "Deep Love",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ffe2847a838ab618ba01bff598fdcc46f.1000x1000x1.png"
    },
    {
      id: 4,
      title: "Someone Like You",
      artist: "Adele",
      mood: "Melancholic",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F48caff7f3cd18b4f4e9b2db1baf3d576.1000x1000x1.png"
    },
    {
      id: 5,
      title: "Closer",
      artist: "The Chainsmokers",
      mood: "Chill",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F9a07bd68aaece8ee9d2dcc75d878027f.1000x1000x1.png"
    },
    {
      id: 6,
      title: "Shape of You",
      artist: "Ed Sheeran",
      mood: "Romantic",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F3710c6f28a35a0635d3e54ea30a8fc5c.1000x1000x1.png"
    }
  ]);

  // Mock data for playlists
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      title: "Happy Vibes",
      description: "Songs to boost your mood and make you feel fantastic all day long",
      coverUrl: "https://i.scdn.co/image/ab67706f00000002261b4231fdb64c7adbdd7d1c",
      songCount: 15
    },
    {
      id: 2,
      title: "Chill Mode",
      description: "Perfect for relaxation and unwinding after a long day",
      coverUrl: "https://i.scdn.co/image/ab67616d0000b273762d1d1d540c6b98693354fd",
      songCount: 12
    },
    {
      id: 3,
      title: "Workout Intensity",
      description: "Keep your energy high and push through any workout with these energetic tracks",
      coverUrl: "https://i.scdn.co/image/ab67616d00001e0256da1ee51c2ebfb001c7ef8a",
      songCount: 20
    },
    {
      id: 4,
      title: "Focus Flow",
      description: "Concentrate better with these carefully selected instrumental tracks",
      coverUrl: "https://i1.sndcdn.com/artworks-m5GmzxRYjSNAcqsi-XVbAiA-t500x500.jpg",
      songCount: 18
    }
  ]);

  // Mock data for recently played
  const [recentlyPlayed, setRecentlyPlayed] = useState([
    {
      id: 7,
      title: "Kehne Lagaa",
      artist: "Rushil Aswal",
      mood: "Sad",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ff99353f2e00ef3bb0e2e1bf76e262f80.300x300x1.jpg"
    },
    {
      id: 8,
      title: "Beanie",
      artist: "Chezile",
      mood: "Chill",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F98635c01146e2c911b8f4cfbd3361e1a.1000x1000x1.png"
    },
    {
      id: 9,
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      mood: "Happy",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ff9cde4e84e270b73ad462a8585aba5b3.1000x1000x1.png"
    },
    {
      id: 10,
      title: "Heather",
      artist: "Conan Gray",
      mood: "Sad",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Fde57acbff932d538dabdc480ffc66f20.600x600x1.jpg"
    },
    {
      id: 11,
      title: "West Coast",
      artist: "Lana Del Rey",
      mood: "Romantic",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Fb61bc4d2127e278b4a7c90108cf5c965.1000x1000x1.png"
    }
  ]);

  // Function to play a song (just a mock function for now)
  const playSong = (songId) => {
    console.log(`Playing song with id: ${songId}`);
    // In a real app, this would trigger your audio player
    alert(`Now playing song ${songId}`);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Function to scroll to mood section
  const scrollToMoodSection = (e) => {
    e.preventDefault();
    moodSectionRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    });
  };

  // Function to navigate to recommendations page with selected mood
  const navigateToMoodRecommendations = (mood) => {
    navigate(`/recommendations/${mood.toLowerCase()}`);
  };

  // Song card component - Now styled exactly like playlist card
  const SongCard = ({ song }) => (
    <div key={song.id} className="song-card">
      <div className="song-image">
        <img src={song.coverUrl} alt={song.title} />
        <div className="play-button" onClick={() => playSong(song.id)}>
          <span className="play-icon">▶</span>
        </div>
      </div>
      <div className="song-info">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
        <span className="mood-tag">{song.mood}</span>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{getGreeting()}</h1>
        <div className="search-bar">
          <input type="text" placeholder="What do you want to listen to?" />
          <button>Search</button>
        </div>
        <div className="header-actions">
          <Link to="/profile" className="profile-link">My Profile</Link>
          <button onClick={scrollToMoodSection} className="profile-link">Select Mood</button>
          <button className="surprise-btn">Surprise Me!</button>
        </div>
      </header>

      <section className="main-content">
        <div className="section-container">
          <div className="section-header">
            <h2>Recently played</h2>
            <Link to="/recently-played" className="see-all-link">See all</Link>
          </div>
          <div className="songs-grid">
            {recentlyPlayed.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>

        <div className="section-container">
          <div className="section-header">
            <h2>Made for you</h2>
            <Link to="/made-for-you" className="see-all-link">See all</Link>
          </div>
          <div className="playlists-grid">
            {playlists.map(playlist => (
              <div key={playlist.id} className="playlist-card">
                <div className="playlist-image">
                  <img src={playlist.coverUrl} alt={playlist.title} />
                  <div className="play-button" onClick={() => playSong(`playlist-${playlist.id}`)}>
                    <span className="play-icon">▶</span>
                  </div>
                </div>
                <div className="playlist-info">
                  <h3>{playlist.title}</h3>
                  <p>{playlist.description}</p>
                  <span className="song-count">{playlist.songCount} songs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-container">
          <div className="section-header">
            <h2>Popular tracks</h2>
            <Link to="/popular" className="see-all-link">See all</Link>
          </div>
          <div className="songs-grid">
            {popularSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>

        <div className="section-container" ref={moodSectionRef}>
          <div className="section-header">
            <h2>Browse by mood</h2>
            <Link to="/moods" className="see-all-link">See all</Link>
          </div>
          <div className="mood-cards">
            <div className="mood-card happy" onClick={() => navigateToMoodRecommendations('Happy')}>
              <h3>Happy</h3>
            </div>
            <div className="mood-card sad" onClick={() => navigateToMoodRecommendations('Sad')}>
              <h3>Sad</h3>
            </div>
            <div className="mood-card energetic" onClick={() => navigateToMoodRecommendations('Energetic')}>
              <h3>Energetic</h3>
            </div>
            <div className="mood-card calm" onClick={() => navigateToMoodRecommendations('Calm')}>
              <h3>Calm</h3>
            </div>
            <div className="mood-card romantic" onClick={() => navigateToMoodRecommendations('Romantic')}>
              <h3>Romantic</h3>
            </div>
            <div className="mood-card focus" onClick={() => navigateToMoodRecommendations('Focus')}>
              <h3>Focus</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;