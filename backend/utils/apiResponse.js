/**
 * Reusable standardized API response helpers
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {string} message - Human-readable success message
 * @param {any} data - Response payload
 * @param {number} statusCode - HTTP status code (default 200)
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Descriptive error message
 * @param {number} statusCode - HTTP status code (default 400)
 * @param {any} errors - Additional validation or error details
 */
const sendError = (res, message, statusCode = 400, errors = null) => {
  const payload = {
    success: false,
    message,
  };

  if (errors !== null) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  sendSuccess,
  sendError,
};

