export const lastfm = {
  apiKey: process.env.LASTFM_API_KEY,
  apiSecret: process.env.LASTFM_API_SECRET,
  baseUrl: 'https://ws.audioscrobbler.com/2.0/'
};

const apiConfig = {
  lastfm
};

export default apiConfig;