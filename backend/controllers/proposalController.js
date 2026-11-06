const Proposal = require('../models/Proposal');
const { getDBStatus } = require('../config/db');
const { inMemoryProposals } = require('../data/proposalStore');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Generate unique reference code
const generateProposalReference = () => {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `PROP-GATH-${year}-${randomDigits}`;
};

/**
 * @route   POST /api/proposals
 * @desc    Submit a comprehensive campus event proposal for committee review
 * @access  Protected
 */
const createProposal = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.leadOrganizer?.email || req.body.leadOrganizer?.name || 'guest_organizer';
    const {
      // Step 1
      title,
      category,
      eventType,
      tagline,
      description,
      objectives,
      intendedAudience,
      eventMode,

      // Step 2
      startDate,
      endDate,
      startTime,
      endTime,
      duration,
      venue,
      building,
      roomDetails,
      expectedParticipants,
      minParticipants,
      maxCapacity,

      // Step 3
      leadOrganizer,
      clubOrSociety,
      facultyCoordinator,
      committeeMembers,

      // Step 4
      registrationType,
      registrationFee,
      maxRegistrations,
      registrationOpeningDate,
      registrationClosingDeadline,
      participationMode,
      teamSizeMin,
      teamSizeMax,
      eligibility,
      instructions,

      // Step 5
      budgetItems,
      totalEstimatedBudget,
      expectedSponsorship,
      otherFunding,
      expectedRegistrationRevenue,
      requestedInstitutionalFunding,

      // Step 6
      prizesOffered,
      firstPlace,
      secondPlace,
      thirdPlace,
      otherRewards,
      totalPrizePool,
      sponsors,

      // Step 7
      rulesList,
      codeOfConduct,
      judgingCriteria,
      cancellationPolicy,
      safetyRequirements,
      equipmentRequirements,
      accessibilityRequirements,

      // Step 8
      agendaItems,

      // Step 9
      posterUrl,
      supportingImages,
      proposalDocumentUrl,
      sponsorshipDocumentUrl,

      // Step 10
      confirmedAccurate,
      acknowledgedPolicies,
    } = req.body;

    // Basic Validation
    if (!title || !title.trim()) {
      return sendError(res, 'Event title is required in Step 1', 400);
    }
    if (!category || !category.trim()) {
      return sendError(res, 'Event category is required in Step 1', 400);
    }
    if (!description || !description.trim()) {
      return sendError(res, 'Event description is required in Step 1', 400);
    }
    if (!startDate || !startDate.trim()) {
      return sendError(res, 'Proposed event start date is required in Step 2', 400);
    }
    if (!startTime || !startTime.trim()) {
      return sendError(res, 'Event start time is required in Step 2', 400);
    }
    if (!endTime || !endTime.trim()) {
      return sendError(res, 'Event end time is required in Step 2', 400);
    }
    if (!venue || !venue.trim()) {
      return sendError(res, 'Proposed venue is required in Step 2', 400);
    }
    if (!clubOrSociety || !clubOrSociety.trim()) {
      return sendError(res, 'Organizing club or society is required in Step 3', 400);
    }

    // Auto-calculate total budget from items if not directly supplied
    let calculatedBudget = Number(totalEstimatedBudget) || 0;
    if (Array.isArray(budgetItems) && budgetItems.length > 0) {
      const sum = budgetItems.reduce((acc, curr) => acc + (Number(curr.estimatedAmount) || 0), 0);
      if (sum > 0) calculatedBudget = sum;
    }

    const proposalReference = generateProposalReference();

    const proposalData = {
      proposalReference,
      user: userId,
      status: 'pending_review',
      reviewFeedback: null,
      reviewedAt: null,
      reviewedBy: null,

      // Step 1
      title: title.trim(),
      category: category.trim(),
      eventType: eventType || 'Technical',
      tagline: tagline ? tagline.trim() : '',
      description: description.trim(),
      objectives: objectives || '',
      intendedAudience: intendedAudience || 'All Campus Students',
      eventMode: eventMode || 'offline',

      // Step 2
      startDate: startDate.trim(),
      endDate: endDate ? endDate.trim() : '',
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      duration: duration || 'Half Day',
      venue: venue.trim(),
      building: building ? building.trim() : '',
      roomDetails: roomDetails ? roomDetails.trim() : '',
      expectedParticipants: Number(expectedParticipants) || 50,
      minParticipants: Number(minParticipants) || 10,
      maxCapacity: Number(maxCapacity) || 100,

      // Step 3
      leadOrganizer: {
        name: (leadOrganizer?.name || req.user?.fullName || 'Lead Organizer').trim(),
        studentId: (leadOrganizer?.studentId || req.user?.studentId || '').trim(),
        department: (leadOrganizer?.department || req.user?.department || '').trim(),
        email: (leadOrganizer?.email || req.user?.email || '').trim().toLowerCase(),
        phone: (leadOrganizer?.phone || '').trim(),
      },
      clubOrSociety: clubOrSociety.trim(),
      facultyCoordinator: {
        name: (facultyCoordinator?.name || '').trim(),
        email: (facultyCoordinator?.email || '').trim().toLowerCase(),
        phone: (facultyCoordinator?.phone || '').trim(),
      },
      committeeMembers: Array.isArray(committeeMembers) ? committeeMembers : [],

      // Step 4
      registrationType: registrationType === 'paid' ? 'paid' : 'free',
      registrationFee: registrationType === 'paid' ? Math.max(0, Number(registrationFee) || 0) : 0,
      maxRegistrations: Number(maxRegistrations) || 100,
      registrationOpeningDate: registrationOpeningDate || '',
      registrationClosingDeadline: registrationClosingDeadline || '',
      participationMode: participationMode === 'team' ? 'team' : 'individual',
      teamSizeMin: Number(teamSizeMin) || 1,
      teamSizeMax: Number(teamSizeMax) || 4,
      eligibility: eligibility || 'Open to all enrolled university students.',
      instructions: instructions || '',

      // Step 5 (Internal Budget)
      budgetItems: Array.isArray(budgetItems) ? budgetItems : [],
      totalEstimatedBudget: calculatedBudget,
      expectedSponsorship: Number(expectedSponsorship) || 0,
      otherFunding: Number(otherFunding) || 0,
      expectedRegistrationRevenue: Number(expectedRegistrationRevenue) || 0,
      requestedInstitutionalFunding: Number(requestedInstitutionalFunding) || 0,

      // Step 6
      prizesOffered: Boolean(prizesOffered),
      firstPlace: firstPlace || '',
      secondPlace: secondPlace || '',
      thirdPlace: thirdPlace || '',
      otherRewards: otherRewards || '',
      totalPrizePool: Number(totalPrizePool) || 0,
      sponsors: Array.isArray(sponsors) ? sponsors : [],

      // Step 7
      rulesList: Array.isArray(rulesList) && rulesList.length > 0
        ? rulesList
        : ['All participants must adhere to campus conduct guidelines and safety protocols.'],
      codeOfConduct: codeOfConduct || 'All participants must abide by the University Code of Conduct.',
      judgingCriteria: judgingCriteria || '',
      cancellationPolicy: cancellationPolicy || 'Notice of withdrawal must be given 24 hours prior.',
      safetyRequirements: safetyRequirements || 'Standard campus safety protocols apply.',
      equipmentRequirements: equipmentRequirements || '',
      accessibilityRequirements: accessibilityRequirements || 'Venue is ramp-accessible.',

      // Step 8
      agendaItems: Array.isArray(agendaItems) ? agendaItems : [],

      // Step 9
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      supportingImages: Array.isArray(supportingImages) ? supportingImages : [],
      proposalDocumentUrl: proposalDocumentUrl || '',
      sponsorshipDocumentUrl: sponsorshipDocumentUrl || '',

      // Step 10
      confirmedAccurate: Boolean(confirmedAccurate),
      acknowledgedPolicies: Boolean(acknowledgedPolicies),
    };

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const created = await Proposal.create(proposalData);
      return res.status(201).json({
        success: true,
        message: 'Your event proposal has been submitted successfully. It will be reviewed by the authorized campus committee.',
        meta: {
          databaseConnected: true,
          proposalReference,
          status: 'pending_review',
        },
        data: created,
      });
    }

    // In-Memory Fallback
    const memoryProposal = {
      _id: `prop_mem_${Date.now()}`,
      ...proposalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryProposals.unshift(memoryProposal);

    return res.status(201).json({
      success: true,
      message: 'Your event proposal has been submitted successfully. It will be reviewed by the authorized campus committee.',
      meta: {
        databaseConnected: false,
        fallback: true,
        proposalReference,
        status: 'pending_review',
      },
      data: memoryProposal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/proposals/my
 * @desc    Get all proposals submitted by authenticated student organizer
 * @access  Protected
 */
const getMyProposals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const proposals = await Proposal.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();

      return sendSuccess(res, 'Student proposals retrieved successfully', proposals);
    }

    const proposals = inMemoryProposals.filter(
      (p) => p.user === userId || p.leadOrganizer?.email === req.user.email
    );

    return res.status(200).json({
      success: true,
      message: 'Student proposals retrieved (Development Fallback Data)',
      meta: { databaseConnected: false, total: proposals.length },
      data: proposals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/proposals/:id
 * @desc    Get proposal details by id or reference code
 * @access  Protected
 */
const getProposalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const userEmail = req.user?.email;
    const dbStatus = getDBStatus();

    let proposal = null;
    if (dbStatus.connected) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        proposal = await Proposal.findById(id).lean();
      }
      if (!proposal) {
        proposal = await Proposal.findOne({ proposalReference: id }).lean();
      }
    } else {
      proposal = inMemoryProposals.find(
        (p) => p._id === id || p.proposalReference === id
      );
    }

    if (!proposal) {
      return sendError(res, 'Event proposal not found', 404);
    }

    // Authorization check: Submitting student, lookup by proposal reference, or admin/reviewer
    const isOwner = !userId || proposal.user === userId || proposal.user?.toString() === userId || (userEmail && proposal.leadOrganizer?.email === userEmail);
    const isAdmin = userRole === 'admin' || userRole === 'reviewer';
    if (!isOwner && !isAdmin) {
      return sendError(res, 'Access denied: You are not authorized to view this proposal', 403);
    }

    return sendSuccess(res, 'Proposal details retrieved successfully', proposal);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/proposals/:id/status
 * @desc    Update proposal review status (Authorized reviewer workflow)
 * @access  Protected (Admin / Reviewer)
 */
const updateProposalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewFeedback } = req.body;

    const allowed = ['pending_review', 'under_review', 'approved', 'rejected', 'revision_requested'];
    if (!allowed.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${allowed.join(', ')}`, 400);
    }

    const dbStatus = getDBStatus();
    const updatePayload = {
      status,
      reviewFeedback: reviewFeedback || null,
      reviewedAt: new Date(),
      reviewedBy: req.user.fullName || req.user.email,
    };

    if (dbStatus.connected) {
      let updated = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        updated = await Proposal.findByIdAndUpdate(id, updatePayload, { new: true });
      }
      if (!updated) {
        updated = await Proposal.findOneAndUpdate({ proposalReference: id }, updatePayload, { new: true });
      }

      if (!updated) {
        return sendError(res, 'Event proposal not found', 404);
      }

      return sendSuccess(res, `Proposal status updated to "${status}"`, updated);
    }

    const idx = inMemoryProposals.findIndex(
      (p) => p._id === id || p.proposalReference === id
    );
    if (idx === -1) {
      return sendError(res, 'Event proposal not found', 404);
    }

    inMemoryProposals[idx] = {
      ...inMemoryProposals[idx],
      ...updatePayload,
      updatedAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      message: `Proposal status updated to "${status}" (Development Fallback)`,
      data: inMemoryProposals[idx],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProposal,
  getMyProposals,
  getProposalById,
  updateProposalStatus,
};
