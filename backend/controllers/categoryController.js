const Category = require('../models/Category');
const { getDBStatus } = require('../config/db');
const { categories: fallbackCategories } = require('../data/seedData');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Seed initial categories if MongoDB is connected and empty
 */
const ensureCategoriesSeeded = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log('🌱 [MongoDB] Seeding event categories into database...');
      await Category.insertMany(fallbackCategories);
      console.log('✅ [MongoDB] Categories seeded successfully.');
    }
  } catch (err) {
    console.warn('⚠️ [MongoDB] Could not auto-seed categories:', err.message);
  }
};

/**
 * @route   GET /api/categories
 * @desc    Get all campus event categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      await ensureCategoriesSeeded();
      const categories = await Category.find().sort({ name: 1 }).lean();
      return sendSuccess(res, 'Categories retrieved from MongoDB', categories);
    }

    // Fallback
    return res.status(200).json({
      success: true,
      message: 'Categories retrieved (Development Fallback Data)',
      meta: {
        fallback: true,
        databaseConnected: false,
      },
      data: fallbackCategories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
};

