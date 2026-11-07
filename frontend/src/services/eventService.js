import api from './api';

export const eventService = {
  // Check backend health
  checkHealth: async () => {
    return await api.get('/health');
  },

  // Get featured events for homepage
  getFeaturedEvents: async (limit = 4) => {
    const res = await api.get('/events/featured', { params: { limit } });
    return res.data || [];
  },

  // Get upcoming events for homepage
  getUpcomingEvents: async (limit = 6) => {
    const res = await api.get('/events/upcoming', { params: { limit } });
    return res.data || [];
  },

  // Get all event categories
  getCategories: async () => {
    const res = await api.get('/categories');
    return res.data || [];
  },

  // Get homepage statistics
  getHomepageStats: async () => {
    const res = await api.get('/stats/overview');
    return res.data || null;
  },

  // Get all events with query parameters (search, category, sort, page)
  getEvents: async (params = {}) => {
    return await api.get('/events', { params });
  },

  // Get single event by id or slug
  getEventById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data || null;
  },

  // Register for an event
  registerForEvent: async (registrationData) => {
    return await api.post('/registrations', registrationData);
  },

  // Get my registrations
  getMyRegistrations: async () => {
    const res = await api.get('/registrations/my');
    return res.data || [];
  },

  // Create a new event (Organizer / Admin)
  createEvent: async (eventData) => {
    const res = await api.post('/events', eventData);
    return res.data;
  },

  // Update an existing event (Event Owner / Admin)
  updateEvent: async (id, eventData) => {
    const res = await api.put(`/events/${id}`, eventData);
    return res.data;
  },

  // Safely cancel or delete an event (Event Owner / Admin)
  deleteEvent: async (id, reason = '') => {
    const res = await api.delete(`/events/${id}`, { data: { reason } });
    return res.data;
  },
};

export default eventService;
