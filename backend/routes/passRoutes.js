const express = require('express');
const router = express.Router();
const {
  getMyPasses,
  getPassByPassId,
  verifyPass,
  checkInPass,
} = require('../controllers/passController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyPasses);
router.get('/:passId', protect, getPassByPassId);

// Gate verifier and admission check-in (Restricted to organizer & admin)
router.post('/verify', protect, authorizeRoles('organizer', 'admin'), verifyPass);
router.post('/checkin', protect, authorizeRoles('organizer', 'admin'), checkInPass);

module.exports = router;

