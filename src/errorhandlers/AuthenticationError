const AppError = require("./AppError");
const { ERROR_STATUS_CODES } = require("./constants");

class AuthenticationError extends AppError {
    constructor(responseMsg = "Unauthorized") {
        super(new Error(responseMsg), ERROR_STATUS_CODES.UNAUTHORIZED, responseMsg);
        this.name = this.constructor.name;
    }
}

module.exports = AuthenticationError;
