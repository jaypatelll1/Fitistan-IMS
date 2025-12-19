const AppError = require("./AppError");
const { ERROR_STATUS_CODES } = require("./constants");

class InvalidRequestError extends AppError {
    constructor(e) {
        if (e && typeof e === "string") {
            e = new Error(e);
        }

        super(e, ERROR_STATUS_CODES.BAD_REQUEST, e?.message ?? "Invalid request");
        this.name = this.constructor.name;
    }
}

module.exports = InvalidRequestError;
