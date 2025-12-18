// routes/App Wrapper/AppWrapper/AppWrapper.js

const AccessManagement = require("../ACCESS MANAGER/AccessManagement");
const { LOG_CONSTANTS } = require("../Constants/FileConstants");
const { logError } = require("../LOG/LogUtilities");

const AppWrapper = (controller, allowedRoles = []) => {
    return async (req, res, next) => {
        try {

            console.log("🔥 AppWrapper triggered for route:", req.path);
            console.log("Allowed roles:", allowedRoles);
            console.log("Current user:", req.user);
            // role comes from authenticateUser middleware
            const userRole = req.user?.role;

            AccessManagement.checkIfAccessGrantedOrThrowError(
                allowedRoles,
                userRole
            );

            await controller(req, res, next);
        } catch (error) {
            logError(
                LOG_CONSTANTS.ERROR.FILE_NAME,
                `AppWrapper Error: ${error.message}`,
                error
            );
            next(error);
        }
    };
};

module.exports = { AppWrapper };
