const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"; // Temporary fix for CORS
let accessToken = null;

// Function to fetch the Spotify Access Token
export const getAccessToken = async () => {
  if (accessToken) return accessToken;

  try {
    const credentials = `${clientId}:${clientSecret}`;
    const encodedCredentials = btoa(credentials);

    const response = await fetch(`${CORS_PROXY}https://accounts.spotify.com/api/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching token:", errorData);
      throw new Error(`Spotify Auth Failed: ${errorData.error_description}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Failed to get Spotify access token:", error);
    throw error;
  }
};

// Function to fetch top songs from a Spotify playlist
export const getTopSongs = async () => {
  try {
    const token = await getAccessToken();
    const playlistId = "37i9dQZF1DXcBWIGoYBM5M"; // Example: Today's Top Hits playlist

    const response = await fetch(`${CORS_PROXY}https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error("Error fetching playlist:", response.statusText);
      throw new Error("Failed to fetch playlist");
    }

    const { items } = await response.json();

    return items.map(({ track }, index) => ({
      id: track.id,
      rank: index + 1,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      duration: Math.floor(track.duration_ms / 1000),
      cover: track.album.images[0]?.url || "https://via.placeholder.com/60",
      preview: track.preview_url || null,
    }));
  } catch (error) {
    console.error("Using fallback data due to error:", error);
    return fallbackTopSongs.map((song, index) => ({
      ...song,
      rank: index + 1,
    }));
  }
};

// Fallback Data
const fallbackTopSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: 200,
    cover: "https://i.scdn.co/image/ab67616d00001e02a935e865e7c4b776ef753a05",
    preview: null,
  },
  {
    id: 2,
    title: "Save Your Tears",
    artist: "The Weeknd",
    duration: 215,
    cover: "https://i.scdn.co/image/ab67616d00001e02a935e865e7c4b776ef753a05",
    preview: null,
  },
];
