class ValidationError extends Error {
  /**
   * @param {string} message - General error message
   * @param {number} statusCode - HTTP status code (default 400)
   * @param {Array} errors - Optional array of field-specific errors
   */
  constructor(message = "Validation error", statusCode = 400, errors = []) {
    super(message);
    this.name = "ValidationError";
    this.status = statusCode;
    this.errors = errors; // [{ field: 'fieldName', message: 'error message' }]
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ValidationError;
