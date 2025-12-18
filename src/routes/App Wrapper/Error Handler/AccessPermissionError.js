// routes/App Wrapper/Error Handler/AccessPermissionError.js

class AccessPermissionError extends Error {
  constructor(message = "Access denied", meta = {}) {
    super(message);

    this.name = "AccessPermissionError";
    this.statusCode = 403;
    this.isOperational = true;
    this.meta = meta;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AccessPermissionError;
