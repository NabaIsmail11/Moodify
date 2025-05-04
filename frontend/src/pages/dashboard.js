import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styling/Dashboard.css';
import AudioPlayer from '../components/AudioPlayer';

// API base URL - should be configured based on environment
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  // Reference for mood section
  const moodSectionRef = useRef(null);
  const navigate = useNavigate();
  
  // State for songs and playlists
  const [popularSongs, setPopularSongs] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  
  // Search related states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Get data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use Promise.all to fetch data in parallel
        const [songsRes, moodsRes, playlistsRes] = await Promise.all([
          axios.get(`${API_URL}/songs/popular`),
          axios.get(`${API_URL}/moods`),
          axios.get(`${API_URL}/playlists/featured`)
        ]);
        
        setPopularSongs(songsRes.data);
        setMoods(moodsRes.data);
        setPlaylists(playlistsRes.data);
        
        // Only fetch recently played if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const recentRes = await axios.get(`${API_URL}/songs/recent`, {
              headers: {
                'Authorization': `Bearer ${token}` 
              }
            });
            setRecentlyPlayed(recentRes.data);
          } catch (recentError) {
            console.error('Error fetching recent songs:', recentError);
            // Use empty array if fetching recent songs fails
            setRecentlyPlayed([]);
          }
        } else {
          // Set empty array if no token
          setRecentlyPlayed([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        
        // Use mock data as fallback
        setPopularSongs([
          {
            id: 1,
            title: "Happy",
            artist: "Pharrell Williams",
            mood: "Joyful",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F08c9cccbe508d70ae05be9c0e7d05358.1000x1000x1.jpg",
            preview: "https://cdns-preview-e.dzcdn.net/stream/c-e77d23e0c8ed7567a507a6d1b6a9ca1b-6.mp3",
            deezerLink: "https://www.deezer.com/track/64804276"
          },
          {
            id: 2,
            title: "Blinding Lights",
            artist: "The Weeknd",
            mood: "Energetic",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F34c1c35ca27a735e6e5f18611acb1c16.1000x1000x1.png",
            preview: "https://cdns-preview-c.dzcdn.net/stream/c-d91eedec735885e1e0c345a37e28f79e-4.mp3",
            deezerLink: "https://www.deezer.com/track/908604612"
          },
          {
            id: 3,
            title: "BIRDS OF A FEATHER",
            artist: "Billie Eilish",
            mood: "Deep Love",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ffe2847a838ab618ba01bff598fdcc46f.1000x1000x1.png",
            preview: "https://cdns-preview-d.dzcdn.net/stream/c-d5a91f3cf9c363b1d6a7513cd9c1c7b3-2.mp3",
            deezerLink: "https://www.deezer.com/track/2322504987"
          },
          {
            id: 4,
            title: "Someone Like You",
            artist: "Adele",
            mood: "Melancholic",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F48caff7f3cd18b4f4e9b2db1baf3d576.1000x1000x1.png",
            preview: "https://cdns-preview-b.dzcdn.net/stream/c-bdfe6aca7d04b3dacd3d3b893dc6a542-6.mp3",
            deezerLink: "https://www.deezer.com/track/13129575"
          },
          {
            id: 5,
            title: "Closer",
            artist: "The Chainsmokers",
            mood: "Chill",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F9a07bd68aaece8ee9d2dcc75d878027f.1000x1000x1.png",
            preview: "https://cdns-preview-2.dzcdn.net/stream/c-294e3c039a56bbd139f2dc5e7ba0b88d-5.mp3",
            deezerLink: "https://www.deezer.com/track/128979222"
          },
          {
            id: 6,
            title: "Shape of You",
            artist: "Ed Sheeran",
            mood: "Romantic",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F3710c6f28a35a0635d3e54ea30a8fc5c.1000x1000x1.png",
            preview: "https://cdns-preview-1.dzcdn.net/stream/c-155dcc1816088b9d5a131adf5c52e871-5.mp3",
            deezerLink: "https://www.deezer.com/track/142390524"
          }
        ]);
        
        setRecentlyPlayed([
          {
            id: 7,
            title: "Kehne Lagaa",
            artist: "Rushil Aswal",
            mood: "Sad",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ff99353f2e00ef3bb0e2e1bf76e262f80.300x300x1.jpg",
            preview: "https://cdns-preview-8.dzcdn.net/stream/c-8dc32e9a2e9904f4e7305c4e03f7cb90-3.mp3",
            deezerLink: "https://www.deezer.com/track/2232208487"
          },
          {
            id: 8,
            title: "Beanie",
            artist: "Chezile",
            mood: "Chill",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F98635c01146e2c911b8f4cfbd3361e1a.1000x1000x1.png",
            preview: "https://cdns-preview-c.dzcdn.net/stream/c-cca63b2c92773d54e26450234f2583e1-2.mp3",
            deezerLink: "https://www.deezer.com/track/1941051377"
          },
          {
            id: 9,
            title: "Watermelon Sugar",
            artist: "Harry Styles",
            mood: "Happy",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ff9cde4e84e270b73ad462a8585aba5b3.1000x1000x1.png",
            preview: "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-5.mp3",
            deezerLink: "https://www.deezer.com/track/908604632"
          },
          {
            id: 10,
            title: "Heather",
            artist: "Conan Gray",
            mood: "Sad",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Fde57acbff932d538dabdc480ffc66f20.600x600x1.jpg",
            preview: "https://cdns-preview-e.dzcdn.net/stream/c-e99ce278c82d7b15e3199393e6c61a2e-3.mp3",
            deezerLink: "https://www.deezer.com/track/1076696432"
          },
          {
            id: 11,
            title: "West Coast",
            artist: "Lana Del Rey",
            mood: "Romantic",
            coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Fb61bc4d2127e278b4a7c90108cf5c965.1000x1000x1.png",
            preview: "https://cdns-preview-b.dzcdn.net/stream/c-bcee63ab02bbbcb9b383d5b47dfb2a73-4.mp3",
            deezerLink: "https://www.deezer.com/track/73073873"
          }
        ]);
        
        setPlaylists([
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
        
        // Default moods if API fails
        setMoods([
          { 
            _id: 1, 
            name: 'Happy', 
            color: '#f8ff00',
            gradient: 'linear-gradient(135deg, #f8ff00, #ff9500)'
          },
          { 
            _id: 2, 
            name: 'Sad', 
            color: '#0396FF',
            gradient: 'linear-gradient(135deg, #0396FF, #0D47A1)'
          },
          { 
            _id: 3, 
            name: 'Energetic', 
            color: '#FF512F',
            gradient: 'linear-gradient(135deg, #FF512F, #DD2476)'
          },
          { 
            _id: 4, 
            name: 'Calm', 
            color: '#1FA2FF',
            gradient: 'linear-gradient(135deg, #1FA2FF, #12D8FA, #A6FFCB)'
          },
          { 
            _id: 5, 
            name: 'Romantic', 
            color: '#F857A6',
            gradient: 'linear-gradient(135deg, #F857A6, #FF5858)'
          },
          { 
            _id: 6, 
            name: 'Focus', 
            color: '#603813',
            gradient: 'linear-gradient(135deg, #603813, #b29f94)'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    try {
      const response = await axios.get(`${API_URL}/songs/search`, {
        params: { query: searchQuery }
      });
      
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching tracks:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Function to handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    
    // Hide search results if input is cleared
    if (e.target.value === '') {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };
  
  // Function to play a song
  const playSong = (song) => {
    // Set the current song which will trigger the audio player to appear
    console.log("Original song data:", song); // For debugging
    
    const standardizedSong = {
      id: song.id || song._id,
      title: song.title || song.name,
      artist: song.artist || song.artistName,
      coverUrl: song.coverUrl || (song.album && song.album.cover_medium) || song.albumArt || song.imageUrl || '/api/placeholder/300/300',
      preview: song.preview || song.previewUrl || song.audioUrl,
      deezerLink: song.deezerLink || song.link || song.externalLink,
      mood: song.mood
    };
    
    console.log("Standardized song data:", standardizedSong); // For debugging
    
    // Don't set current song if there's no preview URL
    if (!standardizedSong.preview) {
      console.error("No preview URL available for this song");
      alert("Sorry, preview is not available for this song");
      return;
    }
    
    setCurrentSong(standardizedSong);
    
    // Record play in backend if user is logged in
    const token = localStorage.getItem('token');
    if (token && standardizedSong.id) {
      // Extract numeric ID if it's a prefixed ID like "deezer_1234"
      const playId = String(standardizedSong.id).includes('_') 
        ? standardizedSong.id.split('_')[1] 
        : standardizedSong.id;
        
      axios.post(`${API_URL}/songs/${playId}/play`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(error => {
        console.error('Error recording song play:', error);
        // Continue playing even if recording fails
      });
    }
  };
  
  // Function to close the audio player
  const closePlayer = () => {
    setCurrentSong(null);
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
  
  // Handle surprise me button
  const handleSurpriseMe = () => {
    try {
      // Get a random mood
      const randomIndex = Math.floor(Math.random() * moods.length);
      const randomMood = moods[randomIndex].name;
      
      // Navigate to that mood's recommendations
      navigate(`/recommendations/${randomMood.toLowerCase()}`);
    } catch (error) {
      console.error('Error with surprise me:', error);
      alert('Something went wrong with surprise me. Please try again.');
    }
  };

  // Navigate to playlist detail page
  const navigateToPlaylist = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  // Song card component - updated to receive full song object
  const SongCard = ({ song }) => (
    <div className="song-card" onClick={() => playSong(song)}>
      <div className="song-image">
        <img 
          src={song.coverUrl || '/api/placeholder/300/300'} 
          alt={song.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/api/placeholder/300/300';
          }}
        />
        <div className="play-button">
          <span className="play-icon">▶</span>
        </div>
      </div>
      <div className="song-info">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
        {song.mood && <span className="mood-tag">{song.mood}</span>}
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <h2>Loading your music...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{getGreeting()}</h1>
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="What do you want to listen to?" 
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button type="submit">Search</button>
        </form>
        <div className="header-actions">
          <Link to="/profile" className="profile-link">My Profile</Link>
          <button onClick={scrollToMoodSection} className="profile-link">Select Mood</button>
          <button className="surprise-btn" onClick={handleSurpriseMe}>Surprise Me!</button>
        </div>
      </header>

      <section className="main-content">
        {/* Search Results Section */}
        {showSearchResults && (
          <div className="section-container">
            <div className="section-header">
              <h2>Search Results for "{searchQuery}"</h2>
              <button 
                onClick={() => {
                  setShowSearchResults(false);
                  setSearchQuery('');
                }} 
                className="see-all-link"
              >
                Clear
              </button>
            </div>
            
            {isSearching ? (
              <div className="loading-spinner"></div>
            ) : searchResults.length > 0 ? (
              <div className="songs-grid">
                {searchResults.map(song => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No songs found for "{searchQuery}". Try another search term.</p>
              </div>
            )}
          </div>
        )}

        {!showSearchResults && recentlyPlayed.length > 0 && (
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
        )}

        {!showSearchResults && (
          <div className="section-container">
            <div className="section-header">
              <h2>Made for you</h2>
              <Link to="/made-for-you" className="see-all-link">See all</Link>
            </div>
            <div className="playlists-grid">
              {playlists.map(playlist => (
                <div 
                  key={playlist._id || playlist.id}
                  className="playlist-card"
                  onClick={() => navigateToPlaylist(playlist._id || playlist.id)}
                >
                  <div className="playlist-image">
                    <img 
                      src={playlist.coverUrl || '/api/placeholder/300/300'} 
                      alt={playlist.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/api/placeholder/300/300';
                      }}
                    />
                    <div className="play-button">
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
        )}

        {!showSearchResults && (
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
        )}

        {!showSearchResults && (
          <div className="section-container" ref={moodSectionRef}>
            <div className="section-header">
              <h2>Browse by mood</h2>
              <Link to="/moods" className="see-all-link">See all</Link>
            </div>
            <div className="mood-cards">
              {moods.map(mood => (
                <div 
                  key={mood._id}
                  className={`mood-card ${mood.name.toLowerCase()}`}
                  onClick={() => navigateToMoodRecommendations(mood.name)}
                  style={{ background: mood.gradient }}
                >
                  <h3>{mood.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      
      {/* Updated AudioPlayer component - now expects a song prop instead of separate properties */}
      {currentSong && (
        <AudioPlayer 
          song={currentSong}
          onClose={closePlayer}
        />
      )}
    </div>
  );
};

export default Dashboard;