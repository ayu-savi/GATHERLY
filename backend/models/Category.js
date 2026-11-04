const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    description: {
      type: String,
      trim: true,
    },
    eventCount: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#0F766E',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);

