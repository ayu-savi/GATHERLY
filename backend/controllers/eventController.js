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
    const limit = parseInt(req.query.limit, 10) || 100;
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

/**
 * @route   POST /api/events
 * @desc    Create a new campus event (Organizer or Admin only)
 * @access  Protected (Organizer / Admin)
 */
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      tagline,
      description,
      category,
      image,
      date,
      endDate,
      time,
      venue,
      capacity,
      registrationFee,
      registrationDeadline,
      rules,
      prizes,
      schedule,
      teamPolicy,
      organizingCommittee,
      isFeatured,
    } = req.body;

    // 1. Validate required fields
    if (!title || !title.trim()) {
      return sendError(res, 'Event title is required', 400);
    }
    if (!description || !description.trim()) {
      return sendError(res, 'Event description is required', 400);
    }
    if (!category || !category.trim()) {
      return sendError(res, 'Event category is required', 400);
    }
    if (!date || !date.trim()) {
      return sendError(res, 'Event date is required (YYYY-MM-DD)', 400);
    }
    if (!time || !time.trim()) {
      return sendError(res, 'Event time is required', 400);
    }
    if (!venue || !venue.trim()) {
      return sendError(res, 'Event venue is required', 400);
    }

    // 2. Validate capacity
    const parsedCapacity = Number(capacity) || 100;
    if (parsedCapacity <= 0 || !Number.isInteger(parsedCapacity)) {
      return sendError(res, 'Event capacity must be a positive integer', 400);
    }

    // 3. Validate date format (YYYY-MM-DD or standard parseable ISO)
    const eventDateObj = new Date(date);
    if (isNaN(eventDateObj.getTime())) {
      return sendError(res, 'Invalid event date format', 400);
    }

    // 4. Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // 5. Build event payload
    const eventData = {
      title: title.trim(),
      slug,
      tagline: tagline ? tagline.trim() : '',
      description: description.trim(),
      category: category.trim(),
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      date: date.trim(),
      endDate: endDate ? endDate.trim() : '',
      time: time.trim(),
      venue: venue.trim(),
      capacity: parsedCapacity,
      registeredCount: 0,
      isFeatured: Boolean(isFeatured),
      isUpcoming: true,
      registrationStatus: 'Open',
      registrationFee: Math.max(0, Number(registrationFee) || 0),
      currency: 'INR',
      registrationDeadline: registrationDeadline || date,
      isCancelled: false,
      cancellationReason: null,
      organizer: req.user.id,
      organizingCommittee: {
        societyName: organizingCommittee?.societyName || 'Campus Society',
        organizerName: req.user.fullName || organizingCommittee?.organizerName || 'Lead Organizer',
        contactPerson: req.user.fullName || organizingCommittee?.contactPerson || 'Lead Organizer',
        contactPhone: organizingCommittee?.contactPhone || req.user.phone || '+91 98765 00000',
        contactEmail: req.user.email || organizingCommittee?.contactEmail || 'events@campus.edu',
        officeLocation: organizingCommittee?.officeLocation || 'Student Activity Center',
      },
      teamPolicy: teamPolicy || { allowed: false, minSize: 1, maxSize: 1 },
      rules: Array.isArray(rules) && rules.length > 0 ? rules : ['Standard campus event code of conduct applies.'],
      prizes: prizes || {},
      schedule: Array.isArray(schedule) ? schedule : [],
    };

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const created = await Event.create(eventData);
      return res.status(201).json({
        success: true,
        message: 'Event created and published successfully to campus stage.',
        meta: { databaseConnected: true },
        data: sanitizePublicEvent(created),
      });
    }

    // In-memory fallback
    const memoryEvent = {
      id: 'evt_' + Date.now().toString(36),
      _id: 'evt_' + Date.now().toString(36),
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fallbackEvents.unshift(memoryEvent);

    return res.status(201).json({
      success: true,
      message: 'Event created and published successfully (Development Mode).',
      meta: { databaseConnected: false, fallback: true },
      data: sanitizePublicEvent(memoryEvent),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/events/:id
 * @desc    Update an existing event (Event Owner or Admin only)
 * @access  Protected (Organizer / Admin)
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    let event = null;
    if (dbStatus.connected) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        event = await Event.findById(id);
      }
      if (!event) {
        event = await Event.findOne({ $or: [{ slug: id }, { id: id }] });
      }
    } else {
      event = fallbackEvents.find((e) => e.id === id || e._id === id || e.slug === id);
    }

    if (!event) {
      return sendError(res, 'Event not found or has been removed', 404);
    }

    // Backend Ownership Enforcement
    const isAdmin = req.user.role === 'admin';
    const eventOrganizerId = event.organizer ? event.organizer.toString() : null;
    const isOwner = Boolean(
      (eventOrganizerId && eventOrganizerId === req.user.id.toString()) ||
      (event.organizingCommittee?.contactEmail && event.organizingCommittee.contactEmail.toLowerCase() === req.user.email.toLowerCase())
    );

    if (!isAdmin && !isOwner) {
      return sendError(res, 'Forbidden: You are not authorized to modify this event', 403);
    }

    // Data Integrity Validations
    const updatePayload = {};

    if (req.body.title !== undefined) updatePayload.title = req.body.title.trim();
    if (req.body.tagline !== undefined) updatePayload.tagline = req.body.tagline.trim();
    if (req.body.description !== undefined) updatePayload.description = req.body.description.trim();
    if (req.body.category !== undefined) updatePayload.category = req.body.category.trim();
    if (req.body.image !== undefined) updatePayload.image = req.body.image.trim();
    if (req.body.time !== undefined) updatePayload.time = req.body.time.trim();
    if (req.body.venue !== undefined) updatePayload.venue = req.body.venue.trim();
    if (req.body.registrationStatus !== undefined) updatePayload.registrationStatus = req.body.registrationStatus;
    if (req.body.rules !== undefined) updatePayload.rules = req.body.rules;
    if (req.body.prizes !== undefined) updatePayload.prizes = req.body.prizes;
    if (req.body.schedule !== undefined) updatePayload.schedule = req.body.schedule;
    if (req.body.registrationFee !== undefined) updatePayload.registrationFee = Math.max(0, Number(req.body.registrationFee) || 0);

    if (req.body.date !== undefined) {
      const parsedDate = new Date(req.body.date);
      if (isNaN(parsedDate.getTime())) {
        return sendError(res, 'Invalid event date format', 400);
      }
      updatePayload.date = req.body.date.trim();
    }

    // Prevent shrinking capacity below existing registered attendees
    if (req.body.capacity !== undefined) {
      const newCapacity = Number(req.body.capacity);
      if (newCapacity <= 0 || !Number.isInteger(newCapacity)) {
        return sendError(res, 'Capacity must be a positive integer', 400);
      }
      const currentRegistered = event.registeredCount || 0;
      if (newCapacity < currentRegistered) {
        return sendError(
          res,
          `Cannot reduce event capacity to ${newCapacity}: ${currentRegistered} attendees are already registered`,
          400
        );
      }
      updatePayload.capacity = newCapacity;
    }

    // Never overwrite registeredCount via general update
    delete updatePayload.registeredCount;

    if (dbStatus.connected) {
      const updated = await Event.findByIdAndUpdate(event._id, updatePayload, { new: true, runValidators: true });
      return sendSuccess(res, 'Event updated successfully', sanitizePublicEvent(updated));
    }

    // Fallback store update
    const idx = fallbackEvents.findIndex((e) => e.id === id || e._id === id || e.slug === id);
    if (idx !== -1) {
      fallbackEvents[idx] = {
        ...fallbackEvents[idx],
        ...updatePayload,
        updatedAt: new Date().toISOString(),
      };
      return res.status(200).json({
        success: true,
        message: 'Event updated successfully (Development Mode)',
        data: sanitizePublicEvent(fallbackEvents[idx]),
      });
    }

    return sendError(res, 'Event not found', 404);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/events/:id
 * @desc    Cancel or delete an event safely (Event Owner or Admin only)
 *          Preserves registrations & digital passes, closes event to new signups
 * @access  Protected (Organizer / Admin)
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const dbStatus = getDBStatus();

    let event = null;
    if (dbStatus.connected) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        event = await Event.findById(id);
      }
      if (!event) {
        event = await Event.findOne({ $or: [{ slug: id }, { id: id }] });
      }
    } else {
      event = fallbackEvents.find((e) => e.id === id || e._id === id || e.slug === id);
    }

    if (!event) {
      return sendError(res, 'Event not found or has already been removed', 404);
    }

    // Backend Ownership Enforcement
    const isAdmin = req.user.role === 'admin';
    const eventOrganizerId = event.organizer ? event.organizer.toString() : null;
    const isOwner = Boolean(
      (eventOrganizerId && eventOrganizerId === req.user.id.toString()) ||
      (event.organizingCommittee?.contactEmail && event.organizingCommittee.contactEmail.toLowerCase() === req.user.email.toLowerCase())
    );

    if (!isAdmin && !isOwner) {
      return sendError(res, 'Forbidden: You are not authorized to cancel or delete this event', 403);
    }

    // Safe Cancellation: Close registrations, flag cancelled, preserve historical registrations & passes
    const cancellationPayload = {
      isCancelled: true,
      registrationStatus: 'Closed',
      cancellationReason: reason || 'Event cancelled by campus organizer/administration',
    };

    if (dbStatus.connected) {
      const cancelled = await Event.findByIdAndUpdate(event._id, cancellationPayload, { new: true });
      return sendSuccess(res, 'Event successfully cancelled. Registrations and digital passes preserved for record.', sanitizePublicEvent(cancelled));
    }

    // Fallback store
    const idx = fallbackEvents.findIndex((e) => e.id === id || e._id === id || e.slug === id);
    if (idx !== -1) {
      fallbackEvents[idx] = {
        ...fallbackEvents[idx],
        ...cancellationPayload,
        updatedAt: new Date().toISOString(),
      };
      return res.status(200).json({
        success: true,
        message: 'Event successfully cancelled. Registrations preserved (Development Mode).',
        data: sanitizePublicEvent(fallbackEvents[idx]),
      });
    }

    return sendError(res, 'Event not found', 404);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeaturedEvents,
  getUpcomingEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};

