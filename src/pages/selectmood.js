import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';

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
      <div style={localStyles.moodsContainer}>
        {moods.map(mood => (
          <button
            key={mood.id}
            style={{
              ...localStyles.moodButton,
              backgroundColor: selectedMood?.id === mood.id ? mood.color : 'rgba(255, 255, 255, 0.1)',
              transform: selectedMood?.id === mood.id ? 'scale(1.1)' : 'scale(1)',
              boxShadow: selectedMood?.id === mood.id ? `0 0 20px ${mood.color}40` : 'none'
            }}
            onClick={() => handleMoodSelect(mood)}
            disabled={selectedMood !== null}
          >
            <span style={localStyles.moodEmoji}>{mood.emoji}</span>
            <span style={localStyles.moodName}>{mood.name}</span>
          </button>
        ))}
      </div>
      
      {selectedMood && (
        <div style={localStyles.selectedFeedback}>
          <p style={localStyles.selectedText}>Selected: {selectedMood.emoji} {selectedMood.name}</p>
          <p style={localStyles.redirectText}>Loading recommendations...</p>
        </div>
      )}
    </Layout>
  );
};

const localStyles = {
  moodsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '30px',
  },
  moodButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '25px 10px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    }
  },
  moodEmoji: {
    fontSize: '36px',
    marginBottom: '8px',
  },
  moodName: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
  },
  selectedFeedback: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: '18px',
    margin: '0 0 5px 0',
  },
  redirectText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    margin: 0,
  }
};

export default SelectMood;
