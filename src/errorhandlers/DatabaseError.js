const AppError = require("./AppError");
const { ERROR_STATUS_CODES } = require("./constants");

class DatabaseError extends AppError {
    constructor(e) {
        if (e && typeof e === "string") {
            e = new Error(e);
        }

        // Extract real message
        const message = e?.message || "Database error occurred";

        super(e, ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR, message);
        if(e.message)console.log("err",e.message);
        
        this.name = this.constructor.name;
    }
}

module.exports = DatabaseError;
