const Event = require('../models/Event');
const { getDBStatus } = require('../config/db');
const { events: fallbackEvents } = require('../data/seedData');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Seed initial events into MongoDB if connected and empty
 */
const ensureEventsSeeded = async () => {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      console.log('🌱 [MongoDB] Seeding initial campus events into database...');
      await Event.insertMany(fallbackEvents);
      console.log('✅ [MongoDB] Events seeded successfully.');
    }
  } catch (err) {
    console.warn('⚠️ [MongoDB] Could not auto-seed events:', err.message);
  }
};

/**
 * @route   GET /api/events/featured
 * @desc    Get featured campus events for homepage
 * @access  Public
 */
const getFeaturedEvents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 4;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      await ensureEventsSeeded();
      const events = await Event.find({ isFeatured: true })
        .limit(limit)
        .sort({ date: 1 })
        .lean();

      return sendSuccess(res, 'Featured events retrieved from MongoDB', events);
    }

    // Database is not connected: Return clearly identified development fallback
    const featured = fallbackEvents.filter((e) => e.isFeatured).slice(0, limit);
    return res.status(200).json({
      success: true,
      message: 'Featured events retrieved (Development Fallback Data)',
      meta: {
        fallback: true,
        databaseConnected: false,
        note: 'MongoDB is offline or MONGO_URI is not configured. Serving local development seed data.',
      },
      data: featured,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/events/upcoming
 * @desc    Get upcoming events for homepage
 * @access  Public
 */
const getUpcomingEvents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      await ensureEventsSeeded();
      const events = await Event.find({ isUpcoming: true })
        .sort({ date: 1 })
        .limit(limit)
        .lean();

      return sendSuccess(res, 'Upcoming events retrieved from MongoDB', events);
    }

    // Fallback
    const upcoming = fallbackEvents.filter((e) => e.isUpcoming).slice(0, limit);
    return res.status(200).json({
      success: true,
      message: 'Upcoming events retrieved (Development Fallback Data)',
      meta: {
        fallback: true,
        databaseConnected: false,
      },
      data: upcoming,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/events
 * @desc    Get all events with search, category filtering, and sorting
 * @access  Public
 */
const getAllEvents = async (req, res, next) => {
  try {
    const { q, category, sort } = req.query;
    const limit = parseInt(req.query.limit, 10) || 20;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      await ensureEventsSeeded();

      const query = {};

      if (category && category !== 'all') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (q && q.trim() !== '') {
        query.$or = [
          { title: { $regex: q.trim(), $options: 'i' } },
          { description: { $regex: q.trim(), $options: 'i' } },
          { venue: { $regex: q.trim(), $options: 'i' } },
          { tags: { $in: [new RegExp(q.trim(), 'i')] } },
        ];
      }

      let sortOption = { date: 1 };
      if (sort === 'popularity') sortOption = { registeredCount: -1 };
      if (sort === 'title') sortOption = { title: 1 };

      const total = await Event.countDocuments(query);
      const events = await Event.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean();

      return res.status(200).json({
        success: true,
        message: 'Events retrieved from MongoDB',
        meta: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          databaseConnected: true,
        },
        data: events,
      });
    }

    // Fallback filtering
    let results = [...fallbackEvents];

    if (category && category.toLowerCase() !== 'all') {
      results = results.filter(
        (e) => e.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (q && q.trim() !== '') {
      const term = q.trim().toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term) ||
          e.venue.toLowerCase().includes(term) ||
          (e.tags && e.tags.some((t) => t.toLowerCase().includes(term)))
      );
    }

    if (sort === 'popularity') {
      results.sort((a, b) => b.registeredCount - a.registeredCount);
    } else if (sort === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      results.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return res.status(200).json({
      success: true,
      message: 'Events retrieved (Development Fallback Data)',
      meta: {
        total: results.length,
        page: 1,
        totalPages: 1,
        fallback: true,
        databaseConnected: false,
      },
      data: results.slice(skip, skip + limit),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by id or slug
 * @access  Public
 */
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      await ensureEventsSeeded();

      let event = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        event = await Event.findById(id).lean();
      }
      if (!event) {
        event = await Event.findOne({ $or: [{ slug: id }, { id: id }] }).lean();
      }

      if (!event) {
        return sendError(res, 'Event not found', 404);
      }

      return sendSuccess(res, 'Event details retrieved from MongoDB', event);
    }

    // Fallback
    const event = fallbackEvents.find((e) => e.id === id || e.slug === id);
    if (!event) {
      return sendError(res, 'Event not found in development seed data', 404);
    }

    return res.status(200).json({
      success: true,
      message: 'Event details retrieved (Development Fallback Data)',
      meta: { fallback: true, databaseConnected: false },
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeaturedEvents,
  getUpcomingEvents,
  getAllEvents,
  getEventById,
};
