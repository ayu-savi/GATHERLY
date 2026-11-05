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
};

export default authService;
