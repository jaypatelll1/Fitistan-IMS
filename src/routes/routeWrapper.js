const { RES_LOCALS, LOG_CONSTANTS } = require("./middleware/constant");
const AccessManagement = require("../businesslogic/accessmanagement/AccessManagement");
const LogUtilities = require("./utilities/LogUtilities.js");

const appWrapper = (callback, allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const userInfo = res.locals[RES_LOCALS.USER_INFO.KEY];

     
      if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        const { roles, organization } = userInfo ?? {};
        AccessManagement.checkIfAccessGrantedOrThrowError(
          allowedRoles,
          { roles, organization }
        );
      }

      
   const result = await callback(req, res, next);

if (result !== undefined && !res.headersSent) {
  res.status(200).json(result);
}


    } catch (err) {
      LogUtilities.createLog(
        LOG_CONSTANTS.ERROR.FILE_NAME,
        "Error",
        err.toString()
      );
      next(err);
    }
  };
};



const successResponseAppWrapper = (callback, allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            const { roles = undefined, organization = undefined } = res.locals[RES_LOCALS.USER_INFO.KEY] ?? {};
            AccessManagement.checkIfAccessGrantedOrThrowError(allowedRoles, { roles, organization });
            await callback(req, res, next);
            res.json({
                "status": "success"
            });
        } catch (e) {
            LogUtilities.createLog(LOG_CONSTANTS.ERROR.FILE_NAME, "Error", e.toString());
            next(e);
        }
    };
};

module.exports = {
    appWrapper,
    successResponseAppWrapper
};
