const AppError = require("./AppError");
const { ERROR_STATUS_CODES } = require("./constants");

class AccessPermissionError extends AppError {
    constructor(responseMsg = "Permission Not Granted For This Operation.") {
        super(new Error(responseMsg), ERROR_STATUS_CODES.FORBIDDEN, responseMsg);
        this.name = this.constructor.name;
    }
}

module.exports = AccessPermissionError;
