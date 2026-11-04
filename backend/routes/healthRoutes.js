const express = require('express');
const router = express.Router();
const { getDBStatus } = require('../config/db');

/**
 * @route   GET /api/health
 * @desc    Check health status of backend API server and database connection
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStatus = getDBStatus();

  return res.status(200).json({
    success: true,
    status: 'OK',
    service: 'GATHERLY Backend REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: dbStatus.connected,
      state: dbStatus.state,
      host: dbStatus.host || 'Not connected / No MONGO_URI configured',
      database: dbStatus.name || 'gatherly',
    },
  });
});

module.exports = router;

