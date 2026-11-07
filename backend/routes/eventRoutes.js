const express = require('express');
const router = express.Router();
const {
  getFeaturedEvents,
  getUpcomingEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventFinancials,
} = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Confidential event financial calculations (Organizer & Admin only)
router.get('/:id/financials', protect, authorizeRoles('organizer', 'admin'), getEventFinancials);

// Public event discovery routes
router.get('/featured', getFeaturedEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Event management lifecycle routes (Organizer & Admin only)
router.post('/', protect, authorizeRoles('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorizeRoles('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), deleteEvent);

module.exports = router;

