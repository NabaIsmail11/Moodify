import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/auth';

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
    <div style={styles.pageContainer}>
      <div style={styles.backgroundImage}></div>
      <div style={styles.backgroundOverlay}></div>
      
      <div style={styles.contentContainer}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>Moodify</div>
            <h2 style={styles.title}>Create Your Account</h2>
            <p style={styles.subtitle}>Join the music revolution today</p>
          </div>
          
          {error && <div style={styles.errorAlert}>{error}</div>}
          
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
                placeholder="****"
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
                placeholder="****"
              />
            </div>
            
            <button type="submit" style={styles.button}>
              Sign Up
            </button>
          </form>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?{' '}
              <Link to="/login" style={styles.link}>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
  },
  backgroundImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: 'url(https://5minuteenglish.com/wp-content/uploads/2024/03/Exploring-English-Through-Different-Genres-of-Music-2-1.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: -2,
  },
  backgroundOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: -1,
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'rgba(20, 20, 30, 0.9)',
    backdropFilter: 'blur(8px)',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logo: {
    color: '#8e44ad',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
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
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  input: {
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    ':focus': {
      borderColor: '#8e44ad',
      boxShadow: '0 0 0 2px rgba(142, 68, 173, 0.3)',
    }
  },
  button: {
    padding: '14px',
    backgroundColor: '#8e44ad',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#9b59b6',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(142, 68, 173, 0.4)',
    }
  },
  errorAlert: {
    backgroundColor: 'rgba(255, 238, 238, 0.2)',
    color: '#ff6b6b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid rgba(255, 107, 107, 0.3)',
  },
  footer: {
    marginTop: '20px',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
  },
  link: {
    color: '#8e44ad',
    textDecoration: 'none',
    fontWeight: '600',
    ':hover': {
      textDecoration: 'underline',
    }
  },
};

export default Signup;