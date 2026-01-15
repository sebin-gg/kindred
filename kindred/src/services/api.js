const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Helper function to make authenticated requests
const makeRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = getToken();
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return await response.json();
};

// Auth API calls
export const authAPI = {
  register: (name, email, password) =>
    makeRequest('/auth/register', 'POST', { name, email, password }),
  
  login: (email, password) =>
    makeRequest('/auth/login', 'POST', { email, password }),
};

// User API calls
export const userAPI = {
  getProfile: () => makeRequest('/users/profile'),
  
  updateProfile: (profileData) =>
    makeRequest('/users/profile', 'PUT', profileData),
  
  getTracks: () => makeRequest('/users/tracks'),
  
  updateTrack: (trackName, points) =>
    makeRequest(`/users/tracks/${trackName}`, 'PUT', { points }),
};

// Journal API calls
export const journalAPI = {
  createEntry: (content, category) =>
    makeRequest('/journal/entries', 'POST', { content, category }),
  
  getEntries: () => makeRequest('/journal/entries'),
  
  deleteEntry: (entryId) =>
    makeRequest(`/journal/entries/${entryId}`, 'DELETE'),
};

// Community API calls
export const communityAPI = {
  getMembers: (location = null, interest = null) => {
    let query = '';
    if (location || interest) {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (interest) params.append('interest', interest);
      query = `?${params.toString()}`;
    }
    return makeRequest(`/community/members${query}`);
  },
  
  getMember: (userId) => makeRequest(`/community/members/${userId}`),
  
  getStats: () => makeRequest('/community/stats'),
};

// Health check
export const checkBackend = () => makeRequest('/health');
