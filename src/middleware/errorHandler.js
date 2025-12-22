  const logger = require('../utils/logger');
  const ResponseHandler = require('../utils/responseHandler');

  const notFoundHandler = (req, res, next) => {
    logger.warn(`404 - ${req.method} ${req.originalUrl}`);
    return ResponseHandler.notFound(res, `Route ${req.originalUrl} not found`);
  };

  const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { path: req.path, method: req.method });

    // Database errors
    if (err.code === '23505') {
      return ResponseHandler.conflict(res, 'Duplicate entry exists');
    }
    if (err.code === '23503') {
      return ResponseHandler.badRequest(res, 'Foreign key violation');
    }

    // Joi validation errors
    if (err.isJoi) {
      const errors = err.details.map((d) => d.message);
      return ResponseHandler.badRequest(res, 'Validation failed', errors);
    }

    // Clerk errors
    if (err.clerkError) {
      return ResponseHandler.unauthorized(res, err.message);
    }

    const statusCode = err.statusCode || 500;
    return ResponseHandler.error(res, err.message || 'Internal server error', statusCode);
  };

  module.exports = { notFoundHandler, errorHandler };
