import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styling/Profile.css';
import EditProfileModal from './editprofile';

const Profile = () => {
  // Mock user data (in real app, this would come from your backend)
  const [userData, setUserData] = useState({
    username: "Laiba",
    profileImage: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ffe2847a838ab618ba01bff598fdcc46f.1000x1000x1.png",
    followers: 42,
    following: 28
  });

  // State for edit profile modal
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Mock data for top artists
  const [topArtists, setTopArtists] = useState([
    {
      id: 1,
      name: "The Marías",
      imageUrl: "https://i.scdn.co/image/ab6761610000e5ebaf586afa2b397f1288683a76",
      genre: "Indie Pop"
    },
    {
      id: 2,
      name: "Adele",
      imageUrl: "https://akamai.sscdn.co/uploadfile/letras/fotos/7/a/d/4/7ad49aeb3a90ad1ecf53bd979e99a486.jpg",
      genre: "Pop"
    },
    {
      id: 3,
      name: "Doechii",
      imageUrl: "https://www.billboard.com/wp-content/uploads/2025/03/doechii-sami-drasin-february-2025-1260.jpg?w=1260&h=840&crop=1",
      genre: "Pop"
    },
    {
      id: 4,
      name: "Kendrick Lamar",
      imageUrl: "https://variety.com/wp-content/uploads/2017/11/kendrick-lamar-variety-hitmakers.jpg?w=1000&h=562&crop=1",
      genre: "Rap"
    },
  ]);

  // Mock data for top tracks
  const [topTracks, setTopTracks] = useState([
    {
      id: 1,
      title: "Happy",
      artist: "Pharrell Williams",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F08c9cccbe508d70ae05be9c0e7d05358.1000x1000x1.jpg",
      duration: "5:55",
      plays: 42
    },
    {
      id: 2,
      title: "Blinding Lights",
      artist: "Weekend",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F34c1c35ca27a735e6e5f18611acb1c16.1000x1000x1.png",
      duration: "4:45",
      plays: 38
    },
    {
      id: 3,
      title: "BIRDS OF A FEATHER",
      artist: "Billie Eilish",
      mood: "Deep Love",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2Ffe2847a838ab618ba01bff598fdcc46f.1000x1000x1.png",
      duration: "3:20",
      plays: 35
    },
    {
      id: 4,
      title: "Someone Like You",
      artist: "Adele",
      mood: "Melancholic",
      coverUrl: "https://t2.genius.com/unsafe/378x378/https%3A%2F%2Fimages.genius.com%2F48caff7f3cd18b4f4e9b2db1baf3d576.1000x1000x1.png",
      duration: "3:53",
      plays: 33
    }
  ]);

  // Mock data for user playlists
  const [userPlaylists, setUserPlaylists] = useState([
    {
      id: 1,
      title: "My Happy Songs",
      description: "Songs that always lift my mood",
      coverUrl: "https://i1.sndcdn.com/artworks-JAolhx3yhKv2SZc9-wF1sGA-t500x500.jpg",
      songCount: 12
    },
    {
      id: 2,
      title: "Rainy Day Vibes",
      description: "Perfect for those melancholic moments",
      coverUrl: "https://i1.sndcdn.com/artworks-000541901130-1jskq9-t500x500.jpg",
      songCount: 8
    },
    {
      id: 3,
      title: "Workout Mix",
      description: "High energy songs to keep me going",
      coverUrl: "https://i.scdn.co/image/ab67616d00001e0256da1ee51c2ebfb001c7ef8a",
      songCount: 15
    },
    {
      id: 4,
      title: "Study Focus",
      description: "Instrumental tracks for better concentration",
      coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg3bMZGtSf4QN4Kg6HmkamfrQdZZ7RyVsMvQ&s",
      songCount: 20
    }
  ]);

  // Function to open edit profile modal
  const openEditProfileModal = () => {
    setIsEditProfileModalOpen(true);
  };

  // Function to close edit profile modal
  const closeEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  // Function to save profile changes
  const saveProfileChanges = (updatedData) => {
    setUserData(updatedData);
    // In a real app, you would also send this data to your backend
    console.log("Profile updated:", updatedData);
  };

  // Function to play a song/playlist (just a mock function for now)
  const play = (id, type) => {
    console.log(`Playing ${type} with id: ${id}`);
    alert(`Now playing ${type} ${id}`);
  };

  // Function to delete a playlist
  const deletePlaylist = (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      setUserPlaylists(userPlaylists.filter(playlist => playlist.id !== playlistId));
      console.log(`Playlist ${playlistId} deleted`);
    }
  };

  // Function to create a new playlist
  const createPlaylist = () => {
    const newPlaylistName = prompt("Enter new playlist name:");
    if (newPlaylistName) {
      const newPlaylist = {
        id: userPlaylists.length + 1,
        title: newPlaylistName,
        description: "New playlist",
        coverUrl: "/api/placeholder/300/300",
        songCount: 0
      };
      setUserPlaylists([...userPlaylists, newPlaylist]);
      console.log("New playlist created:", newPlaylist);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-info">
          <div className="profile-image">
            <img src={userData.profileImage} alt={userData.username} />
          </div>
          <div className="profile-details">
            <h1>{userData.username}</h1>
            <div className="profile-stats">
              <span>{userPlaylists.length} Playlists</span>
              <span>{userData.followers} Followers</span>
              <span>{userData.following} Following</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-profile-btn" onClick={openEditProfileModal}>Edit Profile</button>
          <button className="create-playlist-btn" onClick={createPlaylist}>Create Playlist</button>
        </div>
      </div>

      <div className="profile-content">
        <section className="section-container">
          <div className="section-header">
            <h2>Top Artists</h2>
            <Link to="/top-artists" className="see-all-link">See all</Link>
          </div>
          <div className="artists-grid">
            {topArtists.map(artist => (
              <div key={artist.id} className="artist-card">
                <div className="artist-image">
                  <img src={artist.imageUrl} alt={artist.name} />
                  <div className="play-button" onClick={() => play(artist.id, 'artist')}>
                    <span className="play-icon">▶</span>
                  </div>
                </div>
                <div className="artist-info">
                  <h3>{artist.name}</h3>
                  <p>{artist.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-container">
          <div className="section-header">
            <h2>Top Tracks</h2>
            <Link to="/top-tracks" className="see-all-link">See all</Link>
          </div>
          <div className="tracks-list">
            {topTracks.map((track, index) => (
              <div key={track.id} className="track-item">
                <div className="track-number">{index + 1}</div>
                <div className="track-image">
                  <img src={track.coverUrl} alt={track.title} />
                  <div className="play-button-small" onClick={() => play(track.id, 'track')}>
                    <span className="play-icon">▶</span>
                  </div>
                </div>
                <div className="track-info">
                  <h3>{track.title}</h3>
                  <p>{track.artist}</p>
                </div>
                <div className="track-plays">{track.plays} plays</div>
                <div className="track-duration">{track.duration}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-container">
          <div className="section-header">
            <h2>Your Playlists</h2>
            <Link to="/your-playlists" className="see-all-link">See all</Link>
          </div>
          <div className="playlists-grid">
            {userPlaylists.map(playlist => (
              <div key={playlist.id} className="playlist-card">
                <div className="playlist-image">
                  <img src={playlist.coverUrl} alt={playlist.title} />
                  <div className="play-button" onClick={() => play(playlist.id, 'playlist')}>
                    <span className="play-icon">▶</span>
                  </div>
                </div>
                <div className="playlist-info">
                  <h3>{playlist.title}</h3>
                  <p>{playlist.description}</p>
                  <span className="song-count">{playlist.songCount} songs</span>
                </div>
                <div className="playlist-actions">
                  <button 
                    className="delete-playlist-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(playlist.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <div className="playlist-card create-playlist" onClick={createPlaylist}>
              <div className="create-playlist-content">
                <div className="plus-icon">+</div>
                <p>Create New Playlist</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditProfileModalOpen}
        onClose={closeEditProfileModal}
        userData={userData}
        onSave={saveProfileChanges}
      />
    </div>
  );
};

export default Profile;