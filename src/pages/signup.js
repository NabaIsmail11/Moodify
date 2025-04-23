import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/auth';
import '../styling/Dashboard.css'; // Import the Dashboard styling

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="signup-container" style={styles.signupContainer}>
        <div className="signup-card" style={styles.signupCard}>
          <div style={styles.header}>
            <h1 style={{ marginBottom: '8px' }}>Moodify</h1>
            <p style={styles.subtitle}>Join the music revolution today</p>
          </div>
          
          {error && (
            <div style={styles.errorAlert}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your full name"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="your@email.com"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="surprise-btn" style={styles.signupButton}>
              Sign Up
            </button>
          </form>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?{' '}
              <Link to="/login" className="see-all-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  signupContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
  },
  signupCard: {
    backgroundColor: '#181818',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '30px',
  },
  subtitle: {
    color: '#b3b3b3',
    fontSize: '1rem',
    marginTop: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  label: {
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '700',
    marginBottom: '8px',
  },
  input: {
    padding: '14px 16px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
    transition: 'all 0.3s',
    outline: 'none',
    backgroundColor: '#242424',
    color: 'white',
  },
  signupButton: {
    padding: '14px',
    width: '100%',
    marginTop: '20px',
    fontSize: '1rem',
  },
  errorAlert: {
    backgroundColor: 'rgba(255, 81, 47, 0.2)',
    color: '#ff512f',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '0.875rem',
    textAlign: 'left',
  },
  footer: {
    marginTop: '30px',
  },
  footerText: {
    color: '#b3b3b3',
    fontSize: '0.875rem',
  },
};

export default Signup;
