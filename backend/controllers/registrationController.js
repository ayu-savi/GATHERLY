const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { getDBStatus } = require('../config/db');
const { events: fallbackEvents } = require('../data/seedData');
const { inMemoryRegistrations } = require('../data/registrationStore');
const { generateQRCodeSVG } = require('../utils/qrGenerator');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Generate unique IDs for registration and pass
 */
const generateIdentifiers = (userId) => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const registrationId = `REG-GATH-${timestamp}-${randomSuffix}`;
  const passNum = Math.floor(100000 + Math.random() * 900000);
  const passId = `PASS-GATH-${passNum}`;
  const tokenHash = Buffer.from(`${passId}-${userId}-${Date.now()}`).toString('hex').slice(0, 16).toUpperCase();
  const qrToken = `GATHERLY:PASS:${passId}:${tokenHash}`;
  const qrSvg = generateQRCodeSVG(qrToken);

  return { registrationId, passId, qrToken, qrSvg };
};

/**
 * @route   POST /api/registrations
 * @desc    Register authenticated student for a campus event
 * @access  Protected
 */
const registerForEvent = async (req, res, next) => {
  try {
    const {
      eventId,
      participantName,
      participantEmail,
      participantPhone,
      studentId,
      department,
      registrationType = 'individual',
      teamName,
      teamMembers = [],
      paymentReference,
      isDemoPayment = false,
    } = req.body;

    const userId = req.user.id;

    // 1. Validate participant required fields
    if (!eventId || !participantName || !participantEmail || !participantPhone) {
      return sendError(res, 'Event ID, participant name, email, and phone number are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(participantEmail)) {
      return sendError(res, 'Please provide a valid participant email address', 400);
    }

    const dbStatus = getDBStatus();

    // 2. Fetch event
    let event = null;
    if (dbStatus.connected) {
      if (eventId.match(/^[0-9a-fA-F]{24}$/)) {
        event = await Event.findById(eventId);
      }
      if (!event) {
        event = await Event.findOne({ $or: [{ slug: eventId }, { id: eventId }] });
      }
    } else {
      event = fallbackEvents.find((e) => e.id === eventId || e.slug === eventId);
    }

    if (!event) {
      return sendError(res, 'Event not found or has been removed', 404);
    }

    // 3. Check registration deadline
    if (event.registrationDeadline) {
      const deadlineDate = new Date(event.registrationDeadline);
      if (deadlineDate < new Date()) {
        return sendError(res, 'Registration for this event has closed (deadline passed)', 400);
      }
    }

    // 4. Check capacity
    const registeredCount = event.registeredCount || 0;
    const capacity = event.capacity || 100;
    if (registeredCount >= capacity) {
      return sendError(res, 'Registration is closed: This event has reached full capacity', 400);
    }

    // 5. Prevent duplicate registration
    if (dbStatus.connected) {
      const existing = await Registration.findOne({
        user: userId,
        $or: [{ event: event._id.toString() }, { eventSlug: event.slug }],
        status: { $ne: 'cancelled' },
      });

      if (existing) {
        return sendError(res, 'You are already registered for this campus event', 409);
      }
    } else {
      const existing = inMemoryRegistrations.find(
        (r) =>
          (r.user === userId || r.participantEmail.toLowerCase() === participantEmail.toLowerCase()) &&
          (r.event === eventId || r.eventSlug === event.slug) &&
          r.status !== 'cancelled'
      );

      if (existing) {
        return sendError(res, 'You are already registered for this campus event', 409);
      }
    }

    // 6. Fee and Payment validation
    const fee = event.registrationFee || 0;
    let paymentStatus = fee > 0 ? 'completed' : 'free';
    const txnRef = fee > 0 ? (paymentReference || `DEMO-TXN-${Date.now().toString().slice(-7)}`) : null;

    // 7. Generate identifiers & QR Code
    const { registrationId, passId, qrToken, qrSvg } = generateIdentifiers(userId);

    const registrationData = {
      registrationId,
      passId,
      user: userId,
      event: event._id ? event._id.toString() : event.id,
      eventSlug: event.slug,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventImage: event.image,
      participantName: participantName.trim(),
      participantEmail: participantEmail.toLowerCase().trim(),
      participantPhone: participantPhone.trim(),
      studentId: studentId || 'STU-2026',
      department: department || 'Engineering',
      registrationType,
      teamName: registrationType === 'team' ? (teamName || 'Campus Team') : null,
      teamMembers: registrationType === 'team' ? teamMembers : [],
      paymentStatus,
      paymentAmount: fee,
      paymentReference: txnRef,
      isDemoPayment: fee > 0 ? Boolean(isDemoPayment || true) : false,
      status: 'confirmed',
      qrToken,
      qrSvg,
      checkedIn: false,
      checkedInAt: null,
      createdAt: new Date().toISOString(),
    };

    // 8. Persist registration
    if (dbStatus.connected) {
      const newRegistration = await Registration.create(registrationData);

      // Increment event registeredCount atomically
      await Event.findByIdAndUpdate(event._id, { $inc: { registeredCount: 1 } });

      return res.status(201).json({
        success: true,
        message: 'Successfully registered for event! Your digital pass has been generated.',
        data: newRegistration,
      });
    }

    // In-memory fallback
    inMemoryRegistrations.unshift(registrationData);
    event.registeredCount = (event.registeredCount || 0) + 1;

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for event! Digital pass generated (Development Mode).',
      meta: {
        databaseConnected: false,
        persisted: false,
        storage: 'in-memory-session',
        notice: 'MongoDB is offline. Registration created in development session memory.',
      },
      data: registrationData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/registrations/my
 * @desc    Get all registrations of the authenticated student
 * @access  Protected
 */
const getMyRegistrations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const registrations = await Registration.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();

      return sendSuccess(res, 'Student registrations retrieved from MongoDB', registrations);
    }

    // In-memory fallback (strictly filtered to this student)
    const registrations = inMemoryRegistrations.filter(
      (r) => r.user === userId || r.participantEmail === req.user.email
    );

    return res.status(200).json({
      success: true,
      message: 'Student registrations retrieved (Development Session)',
      meta: {
        databaseConnected: false,
        persisted: false,
        total: registrations.length,
      },
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/registrations/:id
 * @desc    Get single registration by ID or registrationId
 * @access  Protected
 */
const getRegistrationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const dbStatus = getDBStatus();

    let registration = null;

    if (dbStatus.connected) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        registration = await Registration.findById(id).lean();
      }
      if (!registration) {
        registration = await Registration.findOne({
          $or: [{ registrationId: id }, { passId: id }],
        }).lean();
      }
    } else {
      registration = inMemoryRegistrations.find(
        (r) => r._id === id || r.registrationId === id || r.passId === id
      );
    }

    if (!registration) {
      return sendError(res, 'Registration not found', 404);
    }

    // Strict ownership verification: Prevent student from viewing another student's pass
    if (registration.user !== userId && registration.participantEmail !== req.user.email && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized: You do not have permission to view this registration record', 403);
    }

    return sendSuccess(res, 'Registration retrieved successfully', registration);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/registrations/:id
 * @desc    Cancel an event registration
 * @access  Protected
 */
const cancelRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const dbStatus = getDBStatus();

    let registration = null;

    if (dbStatus.connected) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        registration = await Registration.findById(id);
      }
      if (!registration) {
        registration = await Registration.findOne({
          $or: [{ registrationId: id }, { passId: id }],
        });
      }

      if (!registration) {
        return sendError(res, 'Registration not found', 404);
      }

      if (registration.user !== userId && req.user.role !== 'admin') {
        return sendError(res, 'Unauthorized: You can only cancel your own registrations', 403);
      }

      if (registration.status === 'cancelled') {
        return sendError(res, 'This registration has already been cancelled', 400);
      }

      registration.status = 'cancelled';
      await registration.save();

      // Decrement event registeredCount
      await Event.findOneAndUpdate(
        { $or: [{ _id: registration.event }, { slug: registration.eventSlug }] },
        { $inc: { registeredCount: -1 } }
      );

      return sendSuccess(res, 'Registration cancelled successfully', registration);
    }

    // Fallback
    registration = inMemoryRegistrations.find(
      (r) => (r._id === id || r.registrationId === id || r.passId === id) && r.user === userId
    );

    if (!registration) {
      return sendError(res, 'Registration not found', 404);
    }

    if (registration.status === 'cancelled') {
      return sendError(res, 'This registration has already been cancelled', 400);
    }

    registration.status = 'cancelled';
    const ev = fallbackEvents.find((e) => e.id === registration.event || e.slug === registration.eventSlug);
    if (ev && ev.registeredCount > 0) {
      ev.registeredCount -= 1;
    }

    return sendSuccess(res, 'Registration cancelled (Development Mode)', registration);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getRegistrationById,
  cancelRegistration,
};
