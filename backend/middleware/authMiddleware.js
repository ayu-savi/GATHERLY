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

      // Attach decoded user info to request with normalized id and _id
      req.user = {
        ...decoded,
        id: decoded.id || decoded._id,
        _id: decoded.id || decoded._id,
      };
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
      req.user = {
        ...decoded,
        id: decoded.id || decoded._id,
        _id: decoded.id || decoded._id,
      };
    } catch (error) {
      // Ignore token failure for optional auth
    }
  }

  return next();
};

/**
 * Restrict route access to specific user roles (RBAC)
 * @param {...string} roles - e.g. 'admin', 'organizer'
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authorized, please authenticate first', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Forbidden: Role '${req.user.role}' is not authorized to access this operation`,
        403
      );
    }
    next();
  };
};

module.exports = {
  protect,
  optionalProtect,
  authorizeRoles,
};

