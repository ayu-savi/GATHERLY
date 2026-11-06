const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    proposalReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending_review', 'under_review', 'approved', 'rejected', 'revision_requested', 'draft'],
      default: 'pending_review',
      index: true,
    },
    reviewFeedback: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: String,
      default: null,
    },

    // STEP 1 — Basic Event Information
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      default: 'Technical',
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    objectives: {
      type: String,
      default: '',
    },
    intendedAudience: {
      type: String,
      default: 'All Campus Students',
    },
    eventMode: {
      type: String,
      enum: ['offline', 'online', 'hybrid'],
      default: 'offline',
    },

    // STEP 2 — Date, Time & Venue
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      default: '',
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    duration: {
      type: String,
      default: 'Half Day',
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    building: {
      type: String,
      default: '',
    },
    roomDetails: {
      type: String,
      default: '',
    },
    expectedParticipants: {
      type: Number,
      default: 50,
    },
    minParticipants: {
      type: Number,
      default: 10,
    },
    maxCapacity: {
      type: Number,
      default: 100,
    },

    // STEP 3 — Organizer & Committee Details
    leadOrganizer: {
      name: { type: String, required: true },
      studentId: { type: String, default: '' },
      department: { type: String, default: '' },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
    },
    clubOrSociety: {
      type: String,
      required: [true, 'Organizing club or society is required'],
    },
    facultyCoordinator: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    committeeMembers: [
      {
        name: String,
        role: String,
        contact: String,
      },
    ],

    // STEP 4 — Registration & Participation Details
    registrationType: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    maxRegistrations: {
      type: Number,
      default: 100,
    },
    registrationOpeningDate: {
      type: String,
      default: '',
    },
    registrationClosingDeadline: {
      type: String,
      default: '',
    },
    participationMode: {
      type: String,
      enum: ['individual', 'team'],
      default: 'individual',
    },
    teamSizeMin: {
      type: Number,
      default: 1,
    },
    teamSizeMax: {
      type: Number,
      default: 4,
    },
    eligibility: {
      type: String,
      default: 'Open to all enrolled university students with valid student ID.',
    },
    instructions: {
      type: String,
      default: '',
    },

    // STEP 5 — Internal Financial & Budget Proposal
    budgetItems: [
      {
        description: String,
        estimatedAmount: Number,
      },
    ],
    totalEstimatedBudget: {
      type: Number,
      default: 0,
    },
    expectedSponsorship: {
      type: Number,
      default: 0,
    },
    otherFunding: {
      type: Number,
      default: 0,
    },
    expectedRegistrationRevenue: {
      type: Number,
      default: 0,
    },
    requestedInstitutionalFunding: {
      type: Number,
      default: 0,
    },

    // STEP 6 — Prizes, Rewards & Sponsorships
    prizesOffered: {
      type: Boolean,
      default: false,
    },
    firstPlace: {
      type: String,
      default: '',
    },
    secondPlace: {
      type: String,
      default: '',
    },
    thirdPlace: {
      type: String,
      default: '',
    },
    otherRewards: {
      type: String,
      default: '',
    },
    totalPrizePool: {
      type: Number,
      default: 0,
    },
    sponsors: [
      {
        name: String,
        contribution: String,
        benefits: String,
      },
    ],

    // STEP 7 — Event Rules and Requirements
    rulesList: [String],
    codeOfConduct: {
      type: String,
      default: 'All participants must abide by the University Code of Conduct and maintain professional campus decorum.',
    },
    judgingCriteria: {
      type: String,
      default: '',
    },
    cancellationPolicy: {
      type: String,
      default: 'Notice of cancellation must be communicated to the organizers at least 24 hours prior to commencement.',
    },
    safetyRequirements: {
      type: String,
      default: 'Standard campus fire and laboratory safety protocols apply throughout the event duration.',
    },
    equipmentRequirements: {
      type: String,
      default: '',
    },
    accessibilityRequirements: {
      type: String,
      default: 'Venues are ramp-accessible and support universal campus participation.',
    },

    // STEP 8 — Event Agenda
    agendaItems: [
      {
        startTime: String,
        endTime: String,
        title: String,
        description: String,
        venue: String,
      },
    ],

    // STEP 9 — Media & Supporting Documents
    posterUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    },
    supportingImages: [String],
    proposalDocumentUrl: {
      type: String,
      default: '',
    },
    sponsorshipDocumentUrl: {
      type: String,
      default: '',
    },

    // STEP 10 — Review & Confirmation
    confirmedAccurate: {
      type: Boolean,
      default: true,
    },
    acknowledgedPolicies: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Proposal', proposalSchema);

