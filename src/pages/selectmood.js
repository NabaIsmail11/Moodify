/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';
import '../styling/selectmood.css'; // Import the new CSS file

const SelectMood = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  
  const moods = [
    { id: 1, emoji: '😊', name: 'Happy', color: '#F9D71C' },
    { id: 2, emoji: '😢', name: 'Sad', color: '#5D8BF4' },
    { id: 3, emoji: '😡', name: 'Angry', color: '#FF6B6B' },
    { id: 4, emoji: '😌', name: 'Calm', color: '#6BCB77' },
    { id: 5, emoji: '😴', name: 'Tired', color: '#A685E2' },
    { id: 6, emoji: '🤪', name: 'Energetic', color: '#FF9F45' }
  ];
  
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem('selectedMood', JSON.stringify(mood));
    setTimeout(() => navigate('/recommendations'), 1000);
  };
  
  return (
    <Layout
      title="How are you feeling today?"
      subtitle="Select your current mood"
      showNav={true}
    >
      <div className="moods-container">
        {moods.map(mood => (
          <button
            key={mood.id}
            className={`mood-button ${selectedMood?.id === mood.id ? 'selected' : ''}`}
            style={{
              backgroundColor: selectedMood?.id === mood.id ? mood.color : '',
              boxShadow: selectedMood?.id === mood.id ? `0 0 24px ${mood.color}80` : ''
            }}
            onClick={() => handleMoodSelect(mood)}
            disabled={selectedMood !== null}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-name">{mood.name}</span>
          </button>
        ))}
      </div>
      
      {selectedMood && (
        <div className="selected-feedback">
          <p className="selected-text">Selected: {selectedMood.emoji} {selectedMood.name}</p>
          <p className="redirect-text">Loading recommendations...</p>
        </div>
      )}
    </Layout>
  );
};

export default SelectMood;*/
