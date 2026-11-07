import axios from 'axios';

let rawBaseUrl = import.meta.env.VITE_API_URL || '/api';
if (rawBaseUrl.startsWith('http') && !rawBaseUrl.endsWith('/api') && !rawBaseUrl.endsWith('/api/')) {
  rawBaseUrl = rawBaseUrl.replace(/\/+$/, '') + '/api';
}
const API_BASE_URL = rawBaseUrl;

/**
 * Centralized Axios API instance configured for GATHERLY backend
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token if present
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('gatherly_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // LocalStorage access fallback
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // If 401 Unauthorized, trigger session cleanup if needed
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('gatherly_token');
        localStorage.removeItem('gatherly_user');
      } catch (e) {}
    }

    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'Network or server error occurred';

    return Promise.reject(new Error(message));
  }
);

export default api;

