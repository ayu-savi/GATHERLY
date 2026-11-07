const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { sendPasswordResetOtpEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'gatherly_super_secret_jwt_key_2026_dev_env';

// Generate JWT token with 7 days expiration
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Pre-computed bcrypt hash for campus demo password "gatherly123"
const DEMO_PASSWORD_HASH = bcrypt.hashSync('gatherly123', 10);

// In-memory demo students, organizers and administrators for offline / development testing
const fallbackUsers = [
  {
    id: 'usr_student_01',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    passwordHash: DEMO_PASSWORD_HASH,
    studentId: 'STU-2026-089',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43210',
    role: 'student',
  },
  {
    id: 'usr_student_02',
    fullName: 'Priya Patel',
    email: 'priya.patel@campus.edu',
    passwordHash: DEMO_PASSWORD_HASH,
    studentId: 'STU-2026-112',
    department: 'Electronics & Communication',
    phone: '+91 98765 43219',
    role: 'student',
  },
  {
    id: 'usr_organizer_01',
    fullName: 'Vikram Mehta',
    email: 'organizer@campus.edu',
    passwordHash: DEMO_PASSWORD_HASH,
    studentId: 'ORG-2026-007',
    department: 'Student Affairs & Cultural Council',
    phone: '+91 98765 11111',
    role: 'organizer',
  },
  {
    id: 'usr_admin_01',
    fullName: 'Campus Administrator',
    email: 'admin@campus.edu',
    passwordHash: DEMO_PASSWORD_HASH,
    studentId: 'ADM-2026-001',
    department: 'Office of the Dean (Student Welfare)',
    phone: '+91 98765 99999',
    role: 'admin',
  },
];

/**
 * Auto-seed initial demo accounts into MongoDB if connected and database is empty
 */
const ensureUsersSeeded = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 [MongoDB] Seeding initial campus demo accounts (student, organizer, admin)...');
      for (const u of fallbackUsers) {
        await User.create({
          fullName: u.fullName,
          email: u.email,
          password: 'gatherly123',
          studentId: u.studentId,
          department: u.department,
          phone: u.phone,
          role: u.role,
        });
      }
      console.log('✅ [MongoDB] Initial demo accounts seeded successfully.');
    }
  } catch (err) {
    console.warn('⚠️ [MongoDB] Could not auto-seed users:', err.message);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate student and get JWT token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide both email and password', 400);
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      await ensureUsersSeeded();
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return sendError(res, 'Invalid campus email or password', 401);
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return sendError(res, 'Invalid campus email or password', 401);
      }

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      });

      return sendSuccess(res, 'Student authenticated successfully', {
        token,
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          studentId: user.studentId,
          department: user.department,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    // Development Fallback Authentication: Strict credential matching
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = fallbackUsers.find((u) => u.email === normalizedEmail);

    if (!existingUser) {
      return sendError(res, 'Invalid campus email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid campus email or password', 401);
    }

    const token = generateToken({
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      fullName: existingUser.fullName,
    });

    const userProfile = { ...existingUser };
    delete userProfile.passwordHash;

    return res.status(200).json({
      success: true,
      message: 'Authenticated successfully (Development Mode)',
      meta: {
        databaseConnected: false,
        fallback: true,
      },
      data: {
        token,
        user: userProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new campus student account
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password, department, studentId, phone } = req.body;

    if (!fullName || !email || !password) {
      return sendError(res, 'Full name, email, and password are required', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 400);
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const existing = await User.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return sendError(res, 'An account with this email already exists', 409);
      }

      const user = await User.create({
        fullName,
        email: email.toLowerCase().trim(),
        password,
        department: department || 'Computer Science & Engineering',
        studentId: studentId || 'STU-' + Math.floor(1000 + Math.random() * 9000),
        phone: phone || '+91 98765 00000',
        role: 'student',
      });

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      });

      return sendSuccess(res, 'Student account registered successfully', {
        token,
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          studentId: user.studentId,
          department: user.department,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    // Development Fallback Registration
    const normalizedEmail = email.toLowerCase().trim();
    if (fallbackUsers.some((u) => u.email === normalizedEmail)) {
      return sendError(res, 'An account with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: 'usr_' + Date.now(),
      fullName,
      email: normalizedEmail,
      passwordHash,
      studentId: studentId || 'STU-' + Math.floor(1000 + Math.random() * 9000),
      department: department || 'General Engineering',
      phone: phone || '+91 98765 00000',
      role: 'student',
    };
    fallbackUsers.push(newUser);

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    const userProfile = { ...newUser };
    delete userProfile.passwordHash;

    return res.status(201).json({
      success: true,
      message: 'Student account created (Development Mode)',
      meta: {
        databaseConnected: false,
        fallback: true,
      },
      data: {
        token,
        user: userProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated student profile
 * @access  Protected
 */
const getMe = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return sendError(res, 'Student profile not found', 404);
      }
      return sendSuccess(res, 'Student profile retrieved', user);
    }

    // Fallback
    const user = fallbackUsers.find((u) => u.id === req.user.id || u.email === req.user.email);
    if (!user) {
      return sendSuccess(res, 'Student profile retrieved (Session)', {
        id: req.user.id,
        email: req.user.email,
        fullName: req.user.fullName || 'Campus Student',
        department: 'Campus Scholar',
        studentId: 'STU-2026',
        role: req.user.role || 'student',
      });
    }

    const userProfile = { ...user };
    delete userProfile.passwordHash;

    return sendSuccess(res, 'Student profile retrieved (Development)', userProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update authenticated student profile information (strictly whitelist editable fields)
 * @access  Protected
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { fullName, phone, department } = req.body;

    const updatePayload = {};
    if (fullName && typeof fullName === 'string' && fullName.trim()) {
      updatePayload.fullName = fullName.trim();
    }
    if (phone && typeof phone === 'string' && phone.trim()) {
      updatePayload.phone = phone.trim();
    }
    if (department && typeof department === 'string' && department.trim()) {
      updatePayload.department = department.trim();
    }

    if (Object.keys(updatePayload).length === 0) {
      return sendError(res, 'Please provide at least one valid profile field to update', 400);
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updatePayload },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return sendError(res, 'User account not found', 404);
      }

      return sendSuccess(res, 'Profile updated successfully', {
        id: updatedUser._id.toString(),
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
        department: updatedUser.department,
        phone: updatedUser.phone,
        role: updatedUser.role,
      });
    }

    // Fallback store update
    const idx = fallbackUsers.findIndex((u) => u.id === userId || u.email === req.user.email);
    if (idx === -1) {
      return sendError(res, 'User account not found in development store', 404);
    }

    fallbackUsers[idx] = {
      ...fallbackUsers[idx],
      ...updatePayload,
    };

    const sanitized = { ...fallbackUsers[idx] };
    delete sanitized.passwordHash;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully (Development Mode)',
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate and send 6-digit verification OTP to registered campus email
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return sendError(res, 'Please provide your registered email address', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const dbStatus = getDBStatus();

    // Cryptographically secure 6-digit random code
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const cooldownPeriod = new Date(Date.now() + 60 * 1000); // 60 seconds

    if (dbStatus.connected) {
      await ensureUsersSeeded();
      const user = await User.findOne({ email: normalizedEmail });

      // Generic response if user not found to prevent account enumeration
      if (!user) {
        return sendSuccess(
          res,
          'If an account with that email exists, a password reset code has been sent.',
          { email: normalizedEmail, cooldownSeconds: 60 }
        );
      }

      // Check cooldown (60s)
      if (user.resetPasswordCooldown && user.resetPasswordCooldown > Date.now()) {
        const remainingSeconds = Math.ceil((user.resetPasswordCooldown - Date.now()) / 1000);
        return sendError(
          res,
          `Please wait ${remainingSeconds} second(s) before requesting another verification code.`,
          429
        );
      }

      user.resetPasswordOtpHash = otpHash;
      user.resetPasswordOtpExpires = otpExpires;
      user.resetPasswordCooldown = cooldownPeriod;
      user.resetPasswordAttempts = 0;
      user.resetPasswordTokenHash = null;
      user.resetPasswordTokenExpires = null;
      await user.save();

      // Dispatch branded OTP email
      try {
        await sendPasswordResetOtpEmail({
          to: user.email,
          otp: rawOtp,
          recipientName: user.fullName,
        });
      } catch (emailErr) {
        console.error('Email sending error:', emailErr.message);
        return sendError(res, 'Unable to send verification email. Please try again later.', 500);
      }

      return sendSuccess(
        res,
        'If an account with that email exists, a password reset code has been sent.',
        { email: user.email, cooldownSeconds: 60 }
      );
    }

    // Fallback store implementation
    const fallbackUser = fallbackUsers.find((u) => u.email === normalizedEmail);
    if (!fallbackUser) {
      return sendSuccess(
        res,
        'If an account with that email exists, a password reset code has been sent.',
        { email: normalizedEmail, cooldownSeconds: 60 }
      );
    }

    if (fallbackUser.resetPasswordCooldown && fallbackUser.resetPasswordCooldown > Date.now()) {
      const remainingSeconds = Math.ceil((fallbackUser.resetPasswordCooldown - Date.now()) / 1000);
      return sendError(
        res,
        `Please wait ${remainingSeconds} second(s) before requesting another verification code.`,
        429
      );
    }

    fallbackUser.resetPasswordOtpHash = otpHash;
    fallbackUser.resetPasswordOtpExpires = otpExpires;
    fallbackUser.resetPasswordCooldown = cooldownPeriod;
    fallbackUser.resetPasswordAttempts = 0;
    fallbackUser.resetPasswordTokenHash = null;
    fallbackUser.resetPasswordTokenExpires = null;

    try {
      await sendPasswordResetOtpEmail({
        to: fallbackUser.email,
        otp: rawOtp,
        recipientName: fallbackUser.fullName,
      });
    } catch (emailErr) {
      return sendError(res, 'Unable to send verification email. Please try again later.', 500);
    }

    return sendSuccess(
      res,
      'If an account with that email exists, a password reset code has been sent.',
      { email: fallbackUser.email, cooldownSeconds: 60 }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/verify-reset-otp
 * @desc    Verify 6-digit OTP and generate short-lived reset token
 * @access  Public
 */
const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return sendError(res, 'Email and 6-digit verification code are required', 400);
    }

    const cleanOtp = String(otp).trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return sendError(res, 'Verification code must be a 6-digit number', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const dbStatus = getDBStatus();
    const submittedHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');

    if (dbStatus.connected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return sendError(res, 'Invalid verification request', 400);
      }

      // Check max attempts already exceeded
      if (user.resetPasswordAttempts >= 5) {
        user.resetPasswordOtpHash = null;
        user.resetPasswordOtpExpires = null;
        await user.save();
        return sendError(
          res,
          'Too many failed attempts. This verification code has been invalidated. Please request a new one.',
          429
        );
      }

      // Check expiry or no active OTP
      if (!user.resetPasswordOtpHash || !user.resetPasswordOtpExpires || user.resetPasswordOtpExpires < Date.now()) {
        return sendError(res, 'Verification code has expired or is invalid. Please request a new one.', 400);
      }

      // Compare hashes
      if (user.resetPasswordOtpHash !== submittedHash) {
        user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;
        const remaining = 5 - user.resetPasswordAttempts;

        if (remaining <= 0) {
          user.resetPasswordOtpHash = null;
          user.resetPasswordOtpExpires = null;
          await user.save();
          return sendError(
            res,
            'Too many failed attempts. This verification code has been invalidated. Please request a new one.',
            429
          );
        }

        await user.save();
        return sendError(res, `Invalid verification code. ${remaining} attempt(s) remaining.`, 400);
      }

      // Valid OTP: Single-use -> clear OTP, generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      user.resetPasswordOtpHash = null;
      user.resetPasswordOtpExpires = null;
      user.resetPasswordAttempts = 0;
      user.resetPasswordTokenHash = resetTokenHash;
      user.resetPasswordTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      await user.save();

      return sendSuccess(res, 'Verification code confirmed. You may now reset your password.', {
        resetToken,
        email: user.email,
      });
    }

    // Fallback store implementation
    const fallbackUser = fallbackUsers.find((u) => u.email === normalizedEmail);
    if (!fallbackUser) {
      return sendError(res, 'Invalid verification request', 400);
    }

    if (fallbackUser.resetPasswordAttempts >= 5) {
      fallbackUser.resetPasswordOtpHash = null;
      fallbackUser.resetPasswordOtpExpires = null;
      return sendError(
        res,
        'Too many failed attempts. This verification code has been invalidated. Please request a new one.',
        429
      );
    }

    if (!fallbackUser.resetPasswordOtpHash || !fallbackUser.resetPasswordOtpExpires || fallbackUser.resetPasswordOtpExpires < Date.now()) {
      return sendError(res, 'Verification code has expired or is invalid. Please request a new one.', 400);
    }

    if (fallbackUser.resetPasswordOtpHash !== submittedHash) {
      fallbackUser.resetPasswordAttempts = (fallbackUser.resetPasswordAttempts || 0) + 1;
      const remaining = 5 - fallbackUser.resetPasswordAttempts;

      if (remaining <= 0) {
        fallbackUser.resetPasswordOtpHash = null;
        fallbackUser.resetPasswordOtpExpires = null;
        return sendError(
          res,
          'Too many failed attempts. This verification code has been invalidated. Please request a new one.',
          429
        );
      }
      return sendError(res, `Invalid verification code. ${remaining} attempt(s) remaining.`, 400);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    fallbackUser.resetPasswordOtpHash = null;
    fallbackUser.resetPasswordOtpExpires = null;
    fallbackUser.resetPasswordAttempts = 0;
    fallbackUser.resetPasswordTokenHash = resetTokenHash;
    fallbackUser.resetPasswordTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    return sendSuccess(res, 'Verification code confirmed. You may now reset your password.', {
      resetToken,
      email: fallbackUser.email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Validate reset token and update password securely
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return sendError(res, 'Email, reset token, and new password are required', 400);
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return sendError(res, 'Passwords do not match', 400);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const dbStatus = getDBStatus();
    const submittedTokenHash = crypto.createHash('sha256').update(String(resetToken).trim()).digest('hex');

    if (dbStatus.connected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return sendError(res, 'Invalid password reset request', 400);
      }

      if (!user.resetPasswordTokenHash || !user.resetPasswordTokenExpires || user.resetPasswordTokenExpires < Date.now()) {
        return sendError(res, 'Password reset session has expired or is invalid. Please start again.', 400);
      }

      if (user.resetPasswordTokenHash !== submittedTokenHash) {
        return sendError(res, 'Invalid reset token', 400);
      }

      // Invalidate reset tokens immediately
      user.resetPasswordTokenHash = null;
      user.resetPasswordTokenExpires = null;
      user.resetPasswordOtpHash = null;
      user.resetPasswordOtpExpires = null;
      user.resetPasswordAttempts = 0;
      user.resetPasswordCooldown = null;

      // Update password — userSchema.pre('save') handles bcrypt hashing
      user.password = newPassword;
      await user.save();

      return sendSuccess(res, 'Password has been reset successfully. You can now log in with your new password.', {
        email: user.email,
      });
    }

    // Fallback store implementation
    const fallbackUser = fallbackUsers.find((u) => u.email === normalizedEmail);
    if (!fallbackUser) {
      return sendError(res, 'Invalid password reset request', 400);
    }

    if (!fallbackUser.resetPasswordTokenHash || !fallbackUser.resetPasswordTokenExpires || fallbackUser.resetPasswordTokenExpires < Date.now()) {
      return sendError(res, 'Password reset session has expired or is invalid. Please start again.', 400);
    }

    if (fallbackUser.resetPasswordTokenHash !== submittedTokenHash) {
      return sendError(res, 'Invalid reset token', 400);
    }

    fallbackUser.resetPasswordTokenHash = null;
    fallbackUser.resetPasswordTokenExpires = null;
    fallbackUser.resetPasswordOtpHash = null;
    fallbackUser.resetPasswordOtpExpires = null;
    fallbackUser.resetPasswordAttempts = 0;
    fallbackUser.resetPasswordCooldown = null;

    fallbackUser.passwordHash = await bcrypt.hash(newPassword, 10);

    return sendSuccess(res, 'Password has been reset successfully. You can now log in with your new password.', {
      email: fallbackUser.email,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  getMe,
  updateProfile,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  fallbackUsers,
};

