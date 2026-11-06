const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    passId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: String, // String or ObjectId string for flexible compatibility
      required: true,
      index: true,
    },
    event: {
      type: String, // String or ObjectId string
      required: true,
      index: true,
    },
    eventSlug: {
      type: String,
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    eventCategory: {
      type: String,
      default: 'Technical',
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventTime: {
      type: String,
    },
    eventVenue: {
      type: String,
      required: true,
    },
    eventImage: {
      type: String,
    },
    participantName: {
      type: String,
      required: true,
      trim: true,
    },
    participantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    participantPhone: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      trim: true,
      default: 'STU-2026-089',
    },
    department: {
      type: String,
      trim: true,
    },
    registrationType: {
      type: String,
      enum: ['individual', 'team'],
      default: 'individual',
    },
    teamName: {
      type: String,
      trim: true,
    },
    teamMembers: [
      {
        name: { type: String },
        email: { type: String },
        studentId: { type: String },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ['free', 'completed', 'pending', 'refunded'],
      default: 'free',
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    paymentReference: {
      type: String,
      default: null,
    },
    isDemoPayment: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'attended'],
      default: 'confirmed',
    },
    qrToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    qrSvg: {
      type: String,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    // Official Event Results & Prize Lifecycle
    hasResults: {
      type: Boolean,
      default: false,
    },
    resultsPublished: {
      type: Boolean,
      default: false,
    },
    resultsAnnouncementDate: {
      type: Date,
      default: null,
    },
    resultDetails: {
      isWinner: { type: Boolean, default: false },
      rank: { type: String, default: null },
      status: { type: String, default: 'Results Awaited' },
      award: { type: String, default: null },
      prizeWon: { type: String, default: null },
      certificateAvailable: { type: Boolean, default: false },
      certificateUrl: { type: String, default: null },
      prizeCollectionStatus: {
        type: String,
        enum: ['Prize Won', 'Collection Pending', 'Collection Instructions Available', 'Collected', 'Not Applicable'],
        default: 'Not Applicable',
      },
      prizeCollectionInstructions: { type: String, default: null },
      announcedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness per user and event in MongoDB
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);

