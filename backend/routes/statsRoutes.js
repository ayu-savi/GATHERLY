const express = require('express');
const router = express.Router();
const { getHomepageStats } = require('../controllers/statsController');

router.get('/overview', getHomepageStats);

module.exports = router;

