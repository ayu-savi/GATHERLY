const express = require('express');
const router = express.Router();
const {
  createProposal,
  getMyProposals,
  getProposalById,
  updateProposalStatus,
} = require('../controllers/proposalController');
const { protect, optionalProtect, authorizeRoles } = require('../middleware/authMiddleware');

// Student Organizer routes
router.post('/', optionalProtect, createProposal);
router.get('/my', protect, getMyProposals);
router.get('/:id', protect, getProposalById);

// Reviewer/Admin workflow route (restricted strictly to administrators)
router.patch('/:id/status', protect, authorizeRoles('admin'), updateProposalStatus);

module.exports = router;
