import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import SelectMood from './pages/selectmood';
import Recommendations from './pages/recommendations';
import TopSongs from './pages/topsongs';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/select-mood" element={<SelectMood />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/top-songs" element={<TopSongs />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;