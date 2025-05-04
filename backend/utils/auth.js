// API base URL - adjust this to your backend server location
const API_BASE_URL = 'http://localhost:5000'; // Change this to match your backend URL

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include', // Include cookies if your auth uses them
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Store token in localStorage
    localStorage.setItem('moodifyToken', data.token);
    localStorage.setItem('moodifyUser', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login a user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Include cookies if your auth uses them
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store token in localStorage
    localStorage.setItem('moodifyToken', data.token);
    localStorage.setItem('moodifyUser', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('moodifyToken');
  localStorage.removeItem('moodifyUser');
  // Redirect to login page or home page
  window.location.href = '/login';
};

// Check if user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem('moodifyToken') !== null;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('moodifyUser');
  return user ? JSON.parse(user) : null;
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('moodifyToken');
};

// Add auth header to fetch requests
export const authHeader = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
