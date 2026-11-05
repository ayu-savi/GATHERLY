import api from './api';

export const passService = {
  /**
   * Get all digital passes of the logged-in student
   */
  getMyPasses: async () => {
    return await api.get('/passes/my');
  },

  /**
   * Get single pass details
   */
  getPassByPassId: async (passId) => {
    return await api.get(`/passes/${passId}`);
  },

  /**
   * Verify QR token or Pass ID (for event organizers/security)
   */
  verifyPass: async (data) => {
    return await api.post('/passes/verify', data);
  },

  /**
   * Check in / admit participant
   */
  checkInPass: async (data) => {
    return await api.post('/passes/checkin', data);
  },
};

export default passService;
