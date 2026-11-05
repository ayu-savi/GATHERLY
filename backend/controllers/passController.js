const Registration = require('../models/Registration');
const { getDBStatus } = require('../config/db');
const { inMemoryRegistrations } = require('../data/registrationStore');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @route   GET /api/passes/my
 * @desc    Get all active digital passes of the authenticated student
 * @access  Protected
 */
const getMyPasses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const passes = await Registration.find({
        user: userId,
        status: { $in: ['confirmed', 'attended'] },
      })
        .sort({ createdAt: -1 })
        .lean();

      return sendSuccess(res, 'Digital passes retrieved from MongoDB', passes);
    }

    // In-memory fallback (strictly filtered to this student)
    const passes = inMemoryRegistrations.filter(
      (r) =>
        (r.user === userId || r.participantEmail === req.user.email) &&
        (r.status === 'confirmed' || r.status === 'attended')
    );

    return res.status(200).json({
      success: true,
      message: 'Digital passes retrieved (Development Session)',
      meta: {
        databaseConnected: false,
        total: passes.length,
      },
      data: passes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/passes/:passId
 * @desc    Get details of a single digital pass
 * @access  Public / Protected
 */
const getPassByPassId = async (req, res, next) => {
  try {
    const { passId } = req.params;
    const dbStatus = getDBStatus();

    let pass = null;

    if (dbStatus.connected) {
      pass = await Registration.findOne({ passId }).lean();
    } else {
      pass = inMemoryRegistrations.find((r) => r.passId === passId);
    }

    if (!pass) {
      return sendError(res, 'Digital pass not found', 404);
    }

    return sendSuccess(res, 'Digital pass retrieved successfully', pass);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/passes/verify
 * @desc    Verify QR token authenticity and pass validity for event check-in
 * @access  Public / Organizer
 */
const verifyPass = async (req, res, next) => {
  try {
    const { qrToken, passId, eventSlug } = req.body;

    if (!qrToken && !passId) {
      return sendError(res, 'Either qrToken or passId must be provided for verification', 400);
    }

    const dbStatus = getDBStatus();
    let pass = null;

    const query = {};
    if (qrToken) query.qrToken = qrToken;
    if (passId) query.passId = passId;

    if (dbStatus.connected) {
      pass = await Registration.findOne(query).lean();
    } else {
      pass = inMemoryRegistrations.find(
        (r) => (qrToken && r.qrToken === qrToken) || (passId && r.passId === passId)
      );
    }

    if (!pass) {
      return res.status(404).json({
        success: false,
        valid: false,
        reason: 'INVALID_TOKEN',
        message: 'QR code or pass identifier is unrecognized. Pass not found in system.',
      });
    }

    // Verify event match if eventSlug is supplied
    if (eventSlug && pass.eventSlug !== eventSlug && pass.event !== eventSlug) {
      return res.status(400).json({
        success: false,
        valid: false,
        reason: 'EVENT_MISMATCH',
        message: `Pass is issued for "${pass.eventTitle}", not for this event.`,
        data: {
          passId: pass.passId,
          eventTitle: pass.eventTitle,
        },
      });
    }

    // Check cancellation
    if (pass.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        valid: false,
        reason: 'PASS_CANCELLED',
        message: 'This pass has been cancelled and is no longer valid for admission.',
        data: {
          passId: pass.passId,
          participantName: pass.participantName,
          status: pass.status,
        },
      });
    }

    // Check check-in status
    if (pass.checkedIn) {
      return res.status(200).json({
        success: true,
        valid: false,
        alreadyCheckedIn: true,
        reason: 'ALREADY_CHECKED_IN',
        message: `Pass has ALREADY been scanned and admitted on ${new Date(pass.checkedInAt).toLocaleTimeString()}. Repeated entry is prohibited.`,
        data: {
          passId: pass.passId,
          participantName: pass.participantName,
          eventTitle: pass.eventTitle,
          checkedInAt: pass.checkedInAt,
        },
      });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      reason: 'VERIFIED',
      message: 'Valid digital event pass verified. Ready for gate admission.',
      data: {
        passId: pass.passId,
        registrationId: pass.registrationId,
        participantName: pass.participantName,
        participantEmail: pass.participantEmail,
        studentId: pass.studentId,
        eventTitle: pass.eventTitle,
        eventDate: pass.eventDate,
        eventVenue: pass.eventVenue,
        registrationType: pass.registrationType,
        teamName: pass.teamName,
        paymentStatus: pass.paymentStatus,
        status: pass.status,
        checkedIn: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/passes/checkin
 * @desc    Admit participant and mark pass as checked in
 * @access  Public / Organizer
 */
const checkInPass = async (req, res, next) => {
  try {
    const { passId, qrToken } = req.body;

    if (!passId && !qrToken) {
      return sendError(res, 'Pass ID or QR token required for check-in', 400);
    }

    const dbStatus = getDBStatus();
    let pass = null;

    if (dbStatus.connected) {
      const query = passId ? { passId } : { qrToken };
      pass = await Registration.findOne(query);

      if (!pass) {
        return sendError(res, 'Pass not found', 404);
      }

      if (pass.status === 'cancelled') {
        return sendError(res, 'Cannot check in: Pass is cancelled', 400);
      }

      if (pass.checkedIn) {
        return res.status(409).json({
          success: false,
          message: 'Repeated check-in prevented. Pass already scanned.',
          checkedInAt: pass.checkedInAt,
        });
      }

      pass.checkedIn = true;
      pass.checkedInAt = new Date();
      pass.status = 'attended';
      await pass.save();

      return sendSuccess(res, 'Gate admission confirmed. Participant checked in.', pass);
    }

    // Fallback
    pass = inMemoryRegistrations.find((r) => (passId && r.passId === passId) || (qrToken && r.qrToken === qrToken));

    if (!pass) {
      return sendError(res, 'Pass not found', 404);
    }

    if (pass.status === 'cancelled') {
      return sendError(res, 'Cannot check in: Pass is cancelled', 400);
    }

    if (pass.checkedIn) {
      return res.status(409).json({
        success: false,
        message: 'Repeated check-in prevented. Pass already scanned.',
        checkedInAt: pass.checkedInAt,
      });
    }

    pass.checkedIn = true;
    pass.checkedInAt = new Date().toISOString();
    pass.status = 'attended';

    return sendSuccess(res, 'Gate admission confirmed (Development Session). Participant checked in.', pass);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPasses,
  getPassByPassId,
  verifyPass,
  checkInPass,
};

