const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: String,
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
    },
    capacity: {
      type: Number,
      required: true,
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isUpcoming: {
      type: Boolean,
      default: true,
      index: true,
    },
    registrationStatus: {
      type: String,
      enum: ['Open', 'Filling Fast', 'Waitlist', 'Closed'],
      default: 'Open',
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    registrationDeadline: {
      type: String,
    },
    teamPolicy: {
      allowed: { type: Boolean, default: false },
      minSize: { type: Number, default: 1 },
      maxSize: { type: Number, default: 1 },
      note: { type: String },
    },
    rules: [{ type: String }],
    prizes: {
      first: { type: String },
      second: { type: String },
      third: { type: String },
      total: { type: String },
      perks: { type: String },
    },
    organizingCommittee: {
      societyName: { type: String, required: true },
      organizerName: { type: String },
      contactPerson: { type: String, required: true },
      contactPhone: { type: String, required: true },
      contactEmail: { type: String, required: true },
      officeLocation: { type: String },
    },
    financialConfig: {
      feePerParticipant: { type: Number, default: 0 },
      maxSpots: { type: Number, default: 0 },
      expectedRevenue: { type: Number, default: 0 },
      prizePoolAmount: { type: Number, default: 0 },
      collegeAllocation: { type: Number, default: 0 },
      organizerAllocation: { type: Number, default: 0 },
    },
    schedule: [
      {
        time: { type: String },
        activity: { type: String },
        speakerOrVenue: { type: String },
      },
    ],
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Virtual for checking if seats are full
eventSchema.virtual('isFull').get(function () {
  return this.registeredCount >= this.capacity;
});

// Virtual for free vs paid
eventSchema.virtual('isPaid').get(function () {
  return this.registrationFee > 0;
});

module.exports = mongoose.model('Event', eventSchema);
