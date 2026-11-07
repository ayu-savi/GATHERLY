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

  /**
   * Request 6-digit OTP verification code for forgotten password
   */
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  /**
   * Verify 6-digit OTP and obtain temporary reset token
   */
  verifyResetOtp: async (email, otp) => {
    return await api.post('/auth/verify-reset-otp', { email, otp });
  },

  /**
   * Reset password using verified reset token
   */
  resetPassword: async (email, resetToken, newPassword, confirmPassword) => {
    return await api.post('/auth/reset-password', {
      email,
      resetToken,
      newPassword,
      confirmPassword,
    });
  },
};

export default authService;
