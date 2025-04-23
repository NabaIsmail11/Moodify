import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children, title, subtitle, showNav = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('selectedMood');
    navigate('/login');
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.backgroundImage}></div>
      <div style={styles.backgroundOverlay}></div>
      
      {showNav && (
        <nav style={styles.navbar}>
          <div style={styles.navContent}>
            <Link to="/" style={styles.logo}>Moodify</Link>
            <div style={styles.navLinks}>
              <Link to="/top-songs" style={styles.navLink}>Top Songs</Link>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      
      <div style={styles.contentContainer}>
        <div style={styles.card}>
          {title && <h2 style={styles.title}>{title}</h2>}
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          {children}
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
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 20, 30, 0.9)',
    backdropFilter: 'blur(8px)',
    padding: '15px 20px',
    zIndex: 100,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    color: '#8e44ad',
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'color 0.3s',
    ':hover': {
      color: '#8e44ad',
    }
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'rgba(255, 107, 107, 0.2)',
    }
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '80px 20px 20px',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'rgba(20, 20, 30, 0.9)',
    backdropFilter: 'blur(8px)',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '800px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    marginBottom: '30px',
    textAlign: 'center',
  }
};

export default Layout;