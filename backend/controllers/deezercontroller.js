const axios = require('axios');

// Fetch top artists from Deezer
const getTopArtists = async (req, res) => {
  try {
    const response = await axios.get('https://api.deezer.com/chart/artists');
    res.json(response.data.artists.data); // Return the top artists data
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).json({ message: 'Error fetching top artists' });
  }
};

// Fetch top tracks from Deezer
const getTopTracks = async (req, res) => {
  try {
    const response = await axios.get('https://api.deezer.com/chart/tracks');
    res.json(response.data.tracks.data); // Return the top tracks data
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).json({ message: 'Error fetching top tracks' });
  }
};

module.exports = {
  getTopArtists,
  getTopTracks
};
