import api from './api';

export const eventService = {
  // Check backend health
  checkHealth: async () => {
    return await api.get('/health');
  },

  // Get all events with optional query parameters
  getEvents: async (params = {}) => {
    return await api.get('/events', { params });
  },

  // Get single event by id
  getEventById: async (id) => {
    return await api.get(`/events/${id}`);
  },

  // Get featured events
  getFeaturedEvents: async () => {
    return await api.get('/events/featured');
  },

  // Register for an event
  registerForEvent: async (registrationData) => {
    return await api.post('/registrations', registrationData);
  },

  // Get my registrations
  getMyRegistrations: async () => {
    return await api.get('/registrations/my');
  },
};

export default eventService;

