export const getTopArtists = async (username = null, limit = 10) => {
  try {
    const response = await fetch(`/api/deezer/top-artists?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error fetching top artists: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the data into the format your UI expects
    return data.artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.picture_medium || '/api/placeholder/300/300',
      genre: artist.type || 'Artist'
    }));
  } catch (error) {
    console.error('Error in getTopArtists:', error);
    throw error;
  }
};

export const getTopTracks = async (username = null, limit = 10) => {
  try {
    const response = await fetch(`/api/deezer/top-tracks?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Error fetching top tracks: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the data into the format your UI expects
    return data.tracks.map(track => {
      // Format duration from seconds to mm:ss
      const minutes = Math.floor(track.duration / 60);
      const seconds = track.duration % 60;
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      return {
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        coverUrl: track.album.cover_medium || '/api/placeholder/300/300',
        duration: formattedDuration,
        plays: Math.floor(Math.random() * 50) + 10 // Random play count since Deezer doesn't provide this
      };
    });
  } catch (error) {
    console.error('Error in getTopTracks:', error);
    throw error;
  }
};
