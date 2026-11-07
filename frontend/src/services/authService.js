import api from './api';

export const authService = {
  /**
   * Log in campus student
   */
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  /**
   * Register new campus student
   */
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  /**
   * Get current authenticated student profile
   */
  getMe: async () => {
    return await api.get('/auth/me');
  },

  /**
   * Update student profile information (persists to backend)
   */
  updateProfile: async (userData) => {
    return await api.put('/auth/profile', userData);
  },
};

export default authService;
