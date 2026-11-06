const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/apiResponse');

/**
 * Verify JWT Bearer token in Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'gatherly_super_secret_jwt_key_2026_dev_env'
      );

      // Attach decoded user info to request
      req.user = decoded;
      return next();
    } catch (error) {
      return sendError(res, 'Not authorized, token invalid or expired', 401);
    }
  }

  if (!token) {
    return sendError(res, 'Not authorized, no token provided', 401);
  }
};

/**
 * Optional authentication - populates req.user if valid token exists, otherwise proceeds as guest
 */
const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'gatherly_super_secret_jwt_key_2026_dev_env'
      );
      req.user = decoded;
    } catch (error) {
      // Ignore token failure for optional auth
    }
  }

  return next();
};

module.exports = {
  protect,
  optionalProtect,
};

