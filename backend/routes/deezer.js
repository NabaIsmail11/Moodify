import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/top-artists', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    
    // Call Deezer API
    const response = await axios.get('https://api.deezer.com/chart/0/artists', {
      params: { limit }
    });

    // Check for valid response data
    if (!response.data || !response.data.data) {
      return res.status(404).json({
        success: false,
        message: 'No artists found in Deezer charts'
      });
    }

    res.json({
      success: true,
      artists: response.data.data
    });
  } catch (error) {
    console.error('Error fetching artists from Deezer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching artists from Deezer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/top-tracks', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    
    // Call Deezer API
    const response = await axios.get('https://api.deezer.com/chart/0/tracks', {
      params: { limit }
    });

    // Check for valid response data
    if (!response.data || !response.data.data) {
      return res.status(404).json({
        success: false,
        message: 'No tracks found in Deezer charts'
      });
    }

    res.json({
      success: true,
      tracks: response.data.data
    });
  } catch (error) {
    console.error('Error fetching tracks from Deezer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching tracks from Deezer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
