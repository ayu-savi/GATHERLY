const express = require('express');
const router = express.Router();
const {
  getFeaturedEvents,
  getUpcomingEvents,
  getAllEvents,
  getEventById,
} = require('../controllers/eventController');

router.get('/featured', getFeaturedEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/', getAllEvents);
router.get('/:id', getEventById);

module.exports = router;

