// src/components/AuthForm.jsx
import React from 'react';
import InputField from './input';

const AuthForm = ({ title, formData, errors, onSubmit, onChange, buttonText, footer }) => {
  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>{title}</h2>
      <form onSubmit={onSubmit}>
        {Object.keys(formData).map((field) => (
          <InputField
            key={field}
            label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            type={field.includes('password') ? 'password' : 'text'}
            name={field}
            value={formData[field]}
            onChange={onChange}
            error={errors[field]}
          />
        ))}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          {buttonText}
        </button>
      </form>
      {footer}
    </div>
  );
};

export default AuthForm;