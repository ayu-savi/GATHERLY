const express = require('express');
const router = express.Router();
const {
  getMyPasses,
  getPassByPassId,
  verifyPass,
  checkInPass,
} = require('../controllers/passController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyPasses);
router.get('/:passId', protect, getPassByPassId);
router.post('/verify', verifyPass);
router.post('/checkin', checkInPass);

module.exports = router;

