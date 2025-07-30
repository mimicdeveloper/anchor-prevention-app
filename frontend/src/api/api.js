import axios from 'axios';

const API_BASE_URL = 'https://anchor-prevention-app.onrender.com/api';
  // your Django backend API

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include Authorization header with JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Example: get support posts (this will now send the token automatically)
export const fetchSupportPosts = () => api.get('/support-posts/');

// Example: login user (get JWT token)
export const loginUser = (credentials) => api.post('/token/', credentials);

// Add more API calls as needed...

export default api;
