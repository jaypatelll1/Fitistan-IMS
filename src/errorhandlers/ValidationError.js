class ValidationError extends Error {
  constructor(joiError) {
    super("Validation Error");

    this.status = 400;
    this.name = "ValidationError";

    this.response = {
      status: 400,
      message: "Validation Error",
        
      body_errors: joiError.details.map(detail => ({
        key: detail.path.join("."),
        message: detail.message.replace(/"/g, "")
        
      }))
    };

  }
}

module.exports = ValidationError;
