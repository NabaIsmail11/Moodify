import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { getTopSongs } from '../services/spotifyapi';

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const TopSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const data = await getTopSongs();
      setSongs(data);
      setLoading(false);
    };

    fetchSongs();
  }, []);

  return (
    <Layout title="Top Songs">
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-green-500 text-xl text-center mb-4">Spotify Top Songs</h2>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <p>Loading songs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {songs.map(song => (
              <div key={song.id} className="flex items-center bg-gray-800 p-3 rounded-lg">
                <span className="text-green-400 font-bold w-8">{song.rank}</span>
                <img src={song.cover} alt="Cover" className="w-12 h-12 rounded-md mr-3" />
                <div className="flex-1">
                  <h3 className="text-white text-lg truncate">{song.title}</h3>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </div>
                <span className="text-gray-300 text-sm">{formatDuration(song.duration)}</span>
                {song.preview && (
                  <audio controls className="ml-3 w-24">
                    <source src={song.preview} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TopSongs;
