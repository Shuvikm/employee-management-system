const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

/**
 * Global error handler middleware
 * @param {Error} err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function errorHandler(err, req, res, _next) {
  console.error('Unhandled Error:', err);

  // Handle SQLite unique constraint violation
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGES.EMAIL_EXISTS,
      errors: [{ field: 'email', message: ERROR_MESSAGES.EMAIL_EXISTS }],
    });
  }

  // Handle JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid JSON in request body',
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_ERROR,
  });
}

/**
 * 404 handler for unknown routes
 * @param {object} req
 * @param {object} res
 */
function notFoundHandler(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

module.exports = { errorHandler, notFoundHandler };
