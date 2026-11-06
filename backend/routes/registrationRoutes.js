const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getRegistrationById,
  cancelRegistration,
  getDashboardSummary,
  getRegistrationResults,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.get('/dashboard-summary', protect, getDashboardSummary);
router.get('/:id/results', protect, getRegistrationResults);
router.get('/:id', protect, getRegistrationById);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;
