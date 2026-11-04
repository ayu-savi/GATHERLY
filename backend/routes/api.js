const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const eventRoutes = require('./eventRoutes');
const categoryRoutes = require('./categoryRoutes');
const statsRoutes = require('./statsRoutes');

// Mount routes
router.use('/health', healthRoutes);
router.use('/events', eventRoutes);
router.use('/categories', categoryRoutes);
router.use('/stats', statsRoutes);

// Base route info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to GATHERLY REST API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
      featuredEvents: '/api/events/featured',
      upcomingEvents: '/api/events/upcoming',
      categories: '/api/categories',
      stats: '/api/stats/overview',
    },
  });
});

module.exports = router;
