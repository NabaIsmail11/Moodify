// src/components/InputField.jsx
import React from 'react';

const InputField = ({ label, type, name, value, onChange, error }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '10px',
          border: `1px solid ${error ? '#ff4444' : '#ddd'}`,
          borderRadius: '4px',
          fontSize: '16px'
        }}
      />
      {error && <p style={{ color: '#ff4444', marginTop: '4px', fontSize: '14px' }}>{error}</p>}
    </div>
  );
};

export default InputField;