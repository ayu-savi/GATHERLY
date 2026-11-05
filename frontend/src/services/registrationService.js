import api from './api';

export const registrationService = {
  /**
   * Register authenticated student for an event
   */
  register: async (registrationData) => {
    return await api.post('/registrations', registrationData);
  },

  /**
   * Get all registrations of the logged-in student
   */
  getMyRegistrations: async () => {
    return await api.get('/registrations/my');
  },

  /**
   * Get compact student activity overview statistics and registered events
   */
  getDashboardSummary: async () => {
    return await api.get('/registrations/dashboard-summary');
  },

  /**
   * Get single registration details
   */
  getRegistrationById: async (id) => {
    return await api.get(`/registrations/${id}`);
  },

  /**
   * Cancel an event registration
   */
  cancelRegistration: async (id) => {
    return await api.delete(`/registrations/${id}`);
  },
};

export default registrationService;
