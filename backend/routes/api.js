const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');

// Mount routes
router.use('/health', healthRoutes);

// Base route info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to GATHERLY REST API',
    version: '1.0.0',
    documentation: '/api/health for system status',
  });
});

module.exports = router;

