const Event = require('../models/Event');
const Category = require('../models/Category');
const { getDBStatus } = require('../config/db');
const { events: fallbackEvents, categories: fallbackCategories } = require('../data/seedData');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @route   GET /api/stats/overview
 * @desc    Get real homepage metrics and campus activity totals
 * @access  Public
 */
const getHomepageStats = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const totalEvents = await Event.countDocuments();
      const totalCategories = await Category.countDocuments();

      // Aggregate total participants registered across all events
      const registrationAgg = await Event.aggregate([
        {
          $group: {
            _id: null,
            totalRegistered: { $sum: '$registeredCount' },
            totalCapacity: { $sum: '$capacity' },
          },
        },
      ]);

      const totalParticipants =
        registrationAgg.length > 0 ? registrationAgg[0].totalRegistered : 0;
      const totalCapacity =
        registrationAgg.length > 0 ? registrationAgg[0].totalCapacity : 0;

      // Extract unique organizers
      const organizers = await Event.distinct('organizer.name');
      const totalSocieties = organizers.length;

      return sendSuccess(res, 'Homepage statistics calculated from MongoDB', {
        totalEvents,
        totalParticipants,
        totalCapacity,
        totalCategories,
        totalSocieties,
        databaseConnected: true,
      });
    }

    // Calculated from seed dataset
    const totalEvents = fallbackEvents.length;
    const totalCategories = fallbackCategories.length;
    const totalParticipants = fallbackEvents.reduce(
      (sum, e) => sum + (e.registeredCount || 0),
      0
    );
    const totalCapacity = fallbackEvents.reduce(
      (sum, e) => sum + (e.capacity || 0),
      0
    );
    const uniqueSocieties = new Set(
      fallbackEvents.map((e) => e.organizer && e.organizer.name).filter(Boolean)
    );
    const totalSocieties = uniqueSocieties.size;

    return res.status(200).json({
      success: true,
      message: 'Homepage statistics calculated (Development Fallback Data)',
      meta: {
        fallback: true,
        databaseConnected: false,
      },
      data: {
        totalEvents,
        totalParticipants,
        totalCapacity,
        totalCategories,
        totalSocieties,
        databaseConnected: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHomepageStats,
};
