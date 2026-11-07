const mongoose = require('mongoose');

const photographSchema = new mongoose.Schema(
  {
    photoPath: {
      type: String,
      required: [true, 'Photograph image path is required'],
      trim: true,
    },
    filename: {
      type: String,
      trim: true,
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [150, 'Event name cannot exceed 150 characters'],
    },
    eventDate: {
      type: String,
      required: [true, 'Event date is required'],
      trim: true,
    },
    photographerCredit: {
      type: String,
      trim: true,
      maxlength: [100, 'Photographer credit cannot exceed 100 characters'],
      default: 'Campus Life Contributor',
    },
    photographerSource: {
      type: String,
      trim: true,
      default: '',
    },
    isSocietyAttribution: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [300, 'Caption cannot exceed 300 characters'],
      default: '',
    },
  },
  { _id: true }
);

const galleryCollectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gallery collection title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    photographs: {
      type: [photographSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A gallery collection must contain at least one photograph',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index on isActive for efficient querying
galleryCollectionSchema.index({ isActive: 1 });

const Gallery = mongoose.model('Gallery', galleryCollectionSchema);

module.exports = Gallery;
