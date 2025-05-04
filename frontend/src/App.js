import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import SelectMood from './pages/selectmood';
import Recommendations from './pages/recommendations';
import TopSongs from './pages/topsongs';
import Dashboard from './pages/dashboard';
import Profile from './pages/Profile';
import PlaylistDetail from './pages/PlaylistDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/select-mood" element={<SelectMood />} />
        <Route path="/recommendations/:mood" element={<Recommendations />} />
        <Route path="/top-songs" element={<TopSongs />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/recently-played" element={<TopSongs />} />
        <Route path="/popular" element={<TopSongs />} />
        <Route path="/made-for-you" element={<TopSongs />} />
        <Route path="/moods" element={<SelectMood />} />
      </Routes>
    </Router>
  );
}

export default App;