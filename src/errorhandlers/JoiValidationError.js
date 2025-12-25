const AppError = require("./AppError");
const { ERROR_STATUS_CODES } = require("./constants");

class JoiValidatorError extends AppError {
  constructor(joiError) {
    super(
      "Validation Error",
      ERROR_STATUS_CODES.BAD_REQUEST,
      "Validation Error"
    );

    this.name = "JoiValidatorError";

    this.response = {
      status: 400,
      message: "joi Validation Error",
      body_errors: joiError.details.map(detail => ({
        key: detail.path.join("."),
        message: detail.message.replace(/"/g, "")
      }))
    };
  }
}

module.exports = JoiValidatorError;
