const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const JWT_SECRET = process.env.JWT_SECRET || 'gatherly_super_secret_jwt_key_2026_dev_env';

// Generate JWT token with 7 days expiration
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// In-memory demo students for offline / development testing
const fallbackUsers = [
  {
    id: 'usr_student_01',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    studentId: 'STU-2026-089',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43210',
    role: 'student',
  },
  {
    id: 'usr_student_02',
    fullName: 'Priya Patel',
    email: 'priya.patel@campus.edu',
    studentId: 'STU-2026-112',
    department: 'Electronics & Communication',
    phone: '+91 98765 43219',
    role: 'student',
  },
];

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

    // Development Fallback Authentication
    const normalizedEmail = email.toLowerCase().trim();
    let existingUser = fallbackUsers.find((u) => u.email === normalizedEmail);

    if (!existingUser) {
      // Create ad-hoc student profile for any valid test email
      existingUser = {
        id: 'usr_' + Date.now(),
        fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: normalizedEmail,
        studentId: 'STU-' + Math.floor(1000 + Math.random() * 9000),
        department: 'Engineering & Technology',
        phone: '+91 98765 00000',
        role: 'student',
      };
      fallbackUsers.push(existingUser);
    }

    const token = generateToken({
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      fullName: existingUser.fullName,
    });

    return res.status(200).json({
      success: true,
      message: 'Student authenticated (Development Mode)',
      meta: {
        databaseConnected: false,
        fallback: true,
        notice: 'MongoDB is offline. Authenticated via development identity provider.',
      },
      data: {
        token,
        user: existingUser,
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
    const newUser = {
      id: 'usr_' + Date.now(),
      fullName,
      email: normalizedEmail,
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

    return res.status(201).json({
      success: true,
      message: 'Student account created (Development Mode)',
      meta: {
        databaseConnected: false,
        fallback: true,
      },
      data: {
        token,
        user: newUser,
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

    return sendSuccess(res, 'Student profile retrieved (Development)', user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  getMe,
};
