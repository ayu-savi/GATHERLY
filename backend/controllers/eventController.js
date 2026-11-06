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
 * Helper to parse exact start date and time of an event
 */
const parseEventStartDateTime = (event) => {
  if (!event || !event.date) return new Date(9999, 11, 31);
  let timeStr = '00:00:00';
  if (event.time) {
    const match = event.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      timeStr = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    }
  }
  return new Date(`${event.date}T${timeStr}`);
};

/**
 * Helper to strip internal financial & organizer accounting data from public-facing responses
 * Preserves all student-facing information (title, rules, prizes, schedule, fee, spots, etc.)
 */
const sanitizePublicEvent = (event) => {
  if (!event) return null;
  const raw = event.toObject ? event.toObject() : { ...event };
  const { financialConfig, internalNotes, budgetProposals, ...publicData } = raw;
  return publicData;
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

      return sendSuccess(res, 'Featured events retrieved from MongoDB', events.map(sanitizePublicEvent));
    }

    // Database is not connected: Return clearly identified development fallback
    const featured = fallbackEvents.filter((e) => e.isFeatured).slice(0, limit).map(sanitizePublicEvent);
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
 * @desc    Get upcoming events for homepage (strictly upcoming, chronologically ordered, max 3)
 * @access  Public
 */
const getUpcomingEvents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const dbStatus = getDBStatus();
    const now = new Date();

    if (dbStatus.connected) {
      await ensureEventsSeeded();
      const rawEvents = await Event.find({ isUpcoming: true })
        .sort({ date: 1 })
        .lean();

      const upcoming = rawEvents
        .filter((e) => parseEventStartDateTime(e) >= now || e.isUpcoming)
        .sort((a, b) => parseEventStartDateTime(a) - parseEventStartDateTime(b))
        .slice(0, limit)
        .map(sanitizePublicEvent);

      return sendSuccess(res, 'Upcoming events retrieved from MongoDB', upcoming);
    }

    // Fallback
    const upcoming = fallbackEvents
      .filter((e) => parseEventStartDateTime(e) >= now || e.isUpcoming)
      .sort((a, b) => parseEventStartDateTime(a) - parseEventStartDateTime(b))
      .slice(0, limit)
      .map(sanitizePublicEvent);

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
 * Helper to sort events in chronological order (earliest upcoming first)
 */
const sortEventsChronologically = (eventsList) => {
  const now = new Date();
  return [...eventsList].sort((a, b) => {
    const startA = parseEventStartDateTime(a);
    const startB = parseEventStartDateTime(b);

    const isPastA = startA < now;
    const isPastB = startB < now;

    // Upcoming events come first
    if (!isPastA && isPastB) return -1;
    if (isPastA && !isPastB) return 1;

    // Both upcoming: earliest first
    if (!isPastA && !isPastB) {
      return startA - startB;
    }

    // Both past: most recent past first
    return startB - startA;
  });
};

/**
 * @route   GET /api/events
 * @desc    Get all events with search, category filtering, and automatic chronological ordering
 * @access  Public
 */
const getAllEvents = async (req, res, next) => {
  try {
    const { q, category } = req.query;
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

      const total = await Event.countDocuments(query);
      const rawEvents = await Event.find(query)
        .sort({ date: 1, time: 1 })
        .lean();

      // Ensure exact chronological order with start time and upcoming-first priority
      const sortedEvents = sortEventsChronologically(rawEvents);
      const paginatedEvents = sortedEvents.slice(skip, skip + limit);

      return res.status(200).json({
        success: true,
        message: 'Events retrieved from MongoDB (Chronological order: Earliest first)',
        meta: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
          databaseConnected: true,
        },
        data: paginatedEvents.map(sanitizePublicEvent),
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

    // Automatically sort chronologically: earliest upcoming event first
    results = sortEventsChronologically(results);

    return res.status(200).json({
      success: true,
      message: 'Events retrieved (Development Fallback Data - Chronological: Earliest first)',
      meta: {
        total: results.length,
        page: 1,
        totalPages: 1,
        fallback: true,
        databaseConnected: false,
      },
      data: results.slice(skip, skip + limit).map(sanitizePublicEvent),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by id or slug (sanitized for public viewing)
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

      return sendSuccess(res, 'Event details retrieved from MongoDB', sanitizePublicEvent(event));
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
      data: sanitizePublicEvent(event),
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

