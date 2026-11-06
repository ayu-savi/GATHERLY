const express = require('express');
const router = express.Router();
const {
  createProposal,
  getMyProposals,
  getProposalById,
  updateProposalStatus,
} = require('../controllers/proposalController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// Student Organizer routes
router.post('/', optionalProtect, createProposal);
router.get('/my', protect, getMyProposals);
router.get('/:id', optionalProtect, getProposalById);

// Reviewer/Admin workflow route
router.patch('/:id/status', protect, updateProposalStatus);

module.exports = router;
