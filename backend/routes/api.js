const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const eventRoutes = require('./eventRoutes');
const categoryRoutes = require('./categoryRoutes');
const statsRoutes = require('./statsRoutes');
const authRoutes = require('./authRoutes');
const registrationRoutes = require('./registrationRoutes');
const passRoutes = require('./passRoutes');

// Mount routes
router.use('/health', healthRoutes);
router.use('/events', eventRoutes);
router.use('/categories', categoryRoutes);
router.use('/stats', statsRoutes);
router.use('/auth', authRoutes);
router.use('/registrations', registrationRoutes);
router.use('/passes', passRoutes);

// Base route info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to GATHERLY REST API',
    version: '1.2.0',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
      featuredEvents: '/api/events/featured',
      upcomingEvents: '/api/events/upcoming',
      categories: '/api/categories',
      stats: '/api/stats/overview',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me',
      },
      registrations: {
        create: 'POST /api/registrations',
        my: 'GET /api/registrations/my',
        detail: 'GET /api/registrations/:id',
        cancel: 'DELETE /api/registrations/:id',
      },
      passes: {
        my: 'GET /api/passes/my',
        detail: 'GET /api/passes/:passId',
        verify: 'POST /api/passes/verify',
        checkin: 'POST /api/passes/checkin',
      },
    },
  });
});

module.exports = router;
