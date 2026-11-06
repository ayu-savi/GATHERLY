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

/**
 * Helper to evaluate entry status and lifecycle for a registration
 */
const computeRegistrationLifecycle = (reg) => {
  const isCancelled = reg.status === 'cancelled';
  const isCheckedIn = Boolean(reg.checkedIn);
  const now = new Date();

  // Normalize dates
  const startDateStr = reg.eventDate;
  const endDateStr = reg.eventEndDate || reg.eventDate;

  // Exact start and end datetime parsing
  let startDateTime = null;
  if (startDateStr) {
    let startTimeStr = '00:00:00';
    if (reg.eventTime) {
      const match = reg.eventTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        startTimeStr = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
      }
    }
    startDateTime = new Date(`${startDateStr}T${startTimeStr}`);
  }

  let endDateTime = null;
  if (endDateStr) {
    let endTimeStr = '23:59:59';
    if (reg.eventTime && reg.eventTime.includes('-')) {
      const parts = reg.eventTime.split('-');
      const endPart = parts[1].replace(/IST|UTC|EST/i, '').trim();
      const match = endPart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        endTimeStr = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
      }
    }
    endDateTime = new Date(`${endDateStr}T${endTimeStr}`);
  }

  // Check if today
  let isToday = false;
  if (startDateStr) {
    const todayISO = now.toISOString().split('T')[0];
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    if (startDateStr === todayISO || startDateStr === localToday) {
      isToday = true;
    }
  }

  // Completed check: end date/time has passed
  let isCompleted = false;
  if (endDateTime && !isNaN(endDateTime.getTime())) {
    if (endDateTime < now) {
      isCompleted = true;
    }
  } else if (endDateStr) {
    const defaultEnd = new Date(`${endDateStr}T23:59:59`);
    if (!isNaN(defaultEnd.getTime()) && defaultEnd < now) {
      isCompleted = true;
    }
  }

  // Upcoming check: not completed and not cancelled
  const isUpcoming = !isCompleted && !isCancelled;

  // Entry status mapping strictly matching requirements
  let entryStatus = {
    code: 'ready_for_entry',
    label: 'Ready for Entry',
    badgeVariant: 'success',
    canEnter: true,
  };

  if (isCancelled) {
    entryStatus = {
      code: 'cancelled',
      label: 'Cancelled',
      badgeVariant: 'error',
      canEnter: false,
    };
  } else if (isCheckedIn) {
    entryStatus = {
      code: 'checked_in',
      label: 'Checked In',
      badgeVariant: 'primary',
      canEnter: false,
      checkedInAt: reg.checkedInAt,
    };
  } else if (isCompleted) {
    entryStatus = {
      code: 'event_completed',
      label: 'Event Completed',
      badgeVariant: 'muted',
      canEnter: false,
    };
  }

  // Prepare small date badge object
  let dateBadge = { month: 'TBD', day: '--', weekday: '' };
  if (startDateStr) {
    const d = new Date(`${startDateStr}T12:00:00`);
    if (!isNaN(d.getTime())) {
      dateBadge = {
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day: d.toLocaleString('en-US', { day: '2-digit' }),
        weekday: d.toLocaleString('en-US', { weekday: 'short' }),
      };
    }
  }

  return {
    isCancelled,
    isCheckedIn,
    isCompleted,
    isUpcoming,
    isToday,
    startDateTime,
    endDateTime,
    entryStatus,
    dateBadge,
  };
};

/**
 * Compute official event result retention lifecycle:
 * Rule 1: A completed competitive event must remain accessible until ONE WEEK (7 DAYS)
 *         AFTER ITS OFFICIAL RESULTS ANNOUNCEMENT DATE.
 * Rule 2: If results have not yet been announced, do NOT automatically remove the completed event.
 *         Keep it accessible under "Results Awaited" until results are announced and the 7-day window passes.
 * Rule 3: Non-competitive events use standard 7-day post-completion retention window.
 * Rule 4: Historical registrations are NEVER deleted and remain permanently in My Registrations.
 */
const computeResultRetention = (reg, lifecycle, now = new Date()) => {
  if (!lifecycle.isCompleted) {
    return {
      isDashboardRetained: true,
      retentionReason: 'upcoming_or_ongoing',
      statusText: 'Upcoming',
      daysRemainingInRetention: null,
      retentionExpiryDate: null,
    };
  }

  // If cancelled, do not display as active
  if (lifecycle.isCancelled) {
    return {
      isDashboardRetained: false,
      retentionReason: 'cancelled',
      statusText: 'Cancelled',
      daysRemainingInRetention: null,
      retentionExpiryDate: null,
    };
  }

  // Competitive event with results
  if (reg.hasResults) {
    // A. Results Not Yet Announced -> MUST REMAIN ACCESSIBLE (Results Awaited)
    if (!reg.resultsPublished || !reg.resultsAnnouncementDate) {
      return {
        isDashboardRetained: true,
        retentionReason: 'results_awaited',
        statusText: 'Results Awaited',
        daysRemainingInRetention: null,
        retentionExpiryDate: null,
      };
    }

    // B. Results Officially Published -> Retained for exactly 7 days from official announcement date!
    const announcedAt = new Date(reg.resultsAnnouncementDate);
    const retentionExpiry = new Date(announcedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    const isRetained = now <= retentionExpiry;
    const diffMs = retentionExpiry - now;
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));

    return {
      isDashboardRetained: isRetained,
      retentionReason: isRetained ? 'results_retention_active' : 'results_retention_expired',
      statusText: isRetained ? 'Results Published' : 'Archived to My Registrations',
      daysRemainingInRetention: isRetained ? daysRemaining : 0,
      retentionExpiryDate: retentionExpiry.toISOString(),
      announcedAt: announcedAt.toISOString(),
    };
  }

  // Non-competitive event: standard 7-day post-completion window
  const completedAt = lifecycle.endDateTime || new Date(reg.eventEndDate || reg.eventDate);
  const standardExpiry = new Date(completedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const isRetained = now <= standardExpiry;
  const daysRemaining = Math.max(0, Math.ceil((standardExpiry - now) / (24 * 60 * 60 * 1000)));

  return {
    isDashboardRetained: isRetained,
    retentionReason: isRetained ? 'recent_completion' : 'completion_expired',
    statusText: isRetained ? 'Recently Completed' : 'Archived to My Registrations',
    daysRemainingInRetention: isRetained ? daysRemaining : 0,
    retentionExpiryDate: standardExpiry.toISOString(),
    announcedAt: null,
  };
};

/**
 * @route   GET /api/registrations/dashboard-summary
 * @desc    Get student activity overview statistics, full-width registered events & result retention
 * @access  Protected
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dbStatus = getDBStatus();
    const now = new Date();

    let registrations = [];

    if (dbStatus.connected) {
      registrations = await Registration.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();
    } else {
      registrations = inMemoryRegistrations.filter(
        (r) => r.user === userId || r.participantEmail === req.user.email
      );
    }

    // Process all registrations
    let registeredCount = 0;
    let upcomingCount = 0;
    let admittedCount = 0;
    let completedCount = 0;

    const enriched = registrations.map((reg) => {
      const lifecycle = computeRegistrationLifecycle(reg, now);
      const retention = computeResultRetention(reg, lifecycle, now);

      if (!lifecycle.isCancelled) {
        registeredCount += 1;
        if (lifecycle.isUpcoming) upcomingCount += 1;
        if (lifecycle.isCompleted) completedCount += 1;
      }

      if (lifecycle.isCheckedIn) {
        admittedCount += 1;
      }

      return {
        ...reg,
        entryStatus: lifecycle.entryStatus,
        isCompleted: lifecycle.isCompleted,
        isUpcoming: lifecycle.isUpcoming,
        isToday: lifecycle.isToday,
        startDateTime: lifecycle.startDateTime ? lifecycle.startDateTime.toISOString() : null,
        endDateTime: lifecycle.endDateTime ? lifecycle.endDateTime.toISOString() : null,
        dateBadge: lifecycle.dateBadge,
        retentionInfo: retention,
        hasResults: Boolean(reg.hasResults),
        resultsPublished: Boolean(reg.resultsPublished),
        resultsAnnouncementDate: reg.resultsAnnouncementDate ? new Date(reg.resultsAnnouncementDate).toISOString() : null,
        resultDetails: reg.resultDetails || null,
      };
    });

    // 1. Group A: Upcoming Events (Chronological order: earliest start date/time first)
    const upcomingEvents = enriched
      .filter((reg) => reg.isUpcoming && !reg.isCancelled)
      .sort((a, b) => new Date(a.startDateTime || a.eventDate) - new Date(b.startDateTime || b.eventDate));

    // 2. Group B: Recently Completed Events (Retained on active dashboard)
    // Retention rule:
    // - If competitive with published results: within 7 days of official announcement date
    // - If competitive with results pending: retained under "Results Awaited"
    // - Keep ~1-2 recently completed cards visible on dashboard overview
    const eligibleCompleted = enriched
      .filter((reg) => reg.isCompleted && !reg.isCancelled && reg.retentionInfo?.isDashboardRetained)
      .sort((a, b) => {
        // Priority 1: Events with published results
        if (a.resultsPublished && !b.resultsPublished) return -1;
        if (!a.resultsPublished && b.resultsPublished) return 1;
        // Priority 2: Events with results awaited
        if (a.hasResults && !b.hasResults) return -1;
        if (!a.hasResults && b.hasResults) return 1;
        // Priority 3: Most recently completed
        return new Date(b.eventDate) - new Date(a.eventDate);
      });

    const recentlyCompletedEvents = eligibleCompleted.slice(0, 2);

    // Consolidated full-width registered events list (Upcoming first, then recently completed)
    const fullWidthRegisteredEvents = [...upcomingEvents, ...recentlyCompletedEvents];

    return res.status(200).json({
      success: true,
      message: 'Student dashboard summary retrieved successfully',
      meta: {
        databaseConnected: dbStatus.connected,
        totalRecords: registrations.length,
        activeDashboardCount: fullWidthRegisteredEvents.length,
      },
      data: {
        student: {
          id: req.user.id,
          fullName: req.user.fullName,
          email: req.user.email,
          studentId: req.user.studentId,
          department: req.user.department,
          role: req.user.role,
        },
        stats: {
          registeredEvents: registeredCount,
          upcomingEvents: upcomingCount,
          admittedEvents: admittedCount,
          completedEvents: completedCount,
        },
        upcomingEvents,
        recentlyCompletedEvents,
        registeredEvents: fullWidthRegisteredEvents,
        allRegisteredCount: registeredCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/registrations/:id/results
 * @desc    Get verified event competition results for a student registration
 * @access  Protected
 */
const getRegistrationResults = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const dbStatus = getDBStatus();

    let reg = null;
    if (dbStatus.connected) {
      reg = await Registration.findOne({
        $or: [{ registrationId: id }, { passId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      }).lean();
    } else {
      reg = inMemoryRegistrations.find(
        (r) => r.registrationId === id || r.passId === id || r._id === id
      );
    }

    if (!reg) {
      return sendError(res, 'Registration record not found', 404);
    }

    // Security check: Student can only view results of their own registration
    if (reg.user !== userId && reg.participantEmail !== req.user.email && req.user.role !== 'admin') {
      return sendError(res, 'Access denied: You can only view results for your own registrations', 403);
    }

    if (!reg.hasResults) {
      return res.status(200).json({
        success: true,
        data: {
          hasResults: false,
          status: 'Not Applicable',
          message: 'This event does not have competition results or rankings.',
        },
      });
    }

    if (!reg.resultsPublished) {
      return res.status(200).json({
        success: true,
        data: {
          hasResults: true,
          resultsPublished: false,
          status: 'Results Awaited',
          message: 'Official results for this event have not yet been published by the organizers.',
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Official event results retrieved successfully',
      data: {
        registrationId: reg.registrationId,
        passId: reg.passId,
        eventTitle: reg.eventTitle,
        eventCategory: reg.eventCategory,
        eventDate: reg.eventDate,
        participantName: reg.participantName,
        teamName: reg.teamName,
        studentId: reg.studentId,
        department: reg.department,
        resultsPublished: true,
        resultsAnnouncementDate: reg.resultsAnnouncementDate,
        resultDetails: reg.resultDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getRegistrationById,
  cancelRegistration,
  getDashboardSummary,
  getRegistrationResults,
};

