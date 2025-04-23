import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import '../styling/Dashboard.css'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      loginUser(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="login-container" style={styles.loginContainer}>
        <div className="login-card" style={styles.loginCard}>
          <div style={styles.header}>
            <h1 style={{ marginBottom: '8px' }}>Moodify</h1>
            <p style={styles.subtitle}>Welcome back</p>
          </div>
          
          {error && (
            <div style={styles.errorAlert}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="enter email"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="surprise-btn" style={styles.loginButton}>
              Log In
            </button>
          </form>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account?{' '}
              <Link to="/signup" className="see-all-link">
                Sign up
              </Link>
            </p>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
  },
  loginCard: {
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
  loginButton: {
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
    marginBottom: '10px',
  },
  forgotLink: {
    color: '#b3b3b3',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.3s',
  },
};

export default Login;