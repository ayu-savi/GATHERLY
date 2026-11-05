const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getRegistrationById,
  cancelRegistration,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.get('/:id', protect, getRegistrationById);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;
