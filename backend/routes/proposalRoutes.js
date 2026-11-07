const express = require('express');
const router = express.Router();
const {
  createProposal,
  getAllProposals,
  getMyProposals,
  getProposalById,
  updateProposalStatus,
} = require('../controllers/proposalController');
const { protect, optionalProtect, authorizeRoles } = require('../middleware/authMiddleware');

// Student Organizer routes
router.post('/', optionalProtect, createProposal);
router.get('/my', protect, getMyProposals);

// Administrative review routes (restricted strictly to administrators)
router.get('/', protect, authorizeRoles('admin'), getAllProposals);
router.patch('/:id/status', protect, authorizeRoles('admin'), updateProposalStatus);

// Details route (Accessible by owner or administrator)
router.get('/:id', protect, getProposalById);

module.exports = router;
