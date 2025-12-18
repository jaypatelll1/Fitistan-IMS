// routes/App Wrapper/ACCESS MANAGER/AccessManagement.js

const { ACCESS_ROLES } = require("../Constants/roles");
const AccessPermissionError = require("../Error Handler/AccessPermissionError");

class AccessManagement {
  static checkIfAccessGrantedOrThrowError(allowedRoles = [], userRole) {
    console.log("👤 Logged-in role:", userRole);
    console.log("🔐 Allowed roles:", allowedRoles);

    // Public access
    if (allowedRoles.includes(ACCESS_ROLES.ALL)) {
      return true;
    }

    if (!userRole) {
      throw new AccessPermissionError("User role not found");
    }

    // Role match
    if (allowedRoles.includes(userRole)) {
      return true;
    }

    throw new AccessPermissionError(
      `Access denied. User role: ${userRole}, Required roles: ${allowedRoles.join(", ")}`,
      {
        userRole,
        requiredRoles: allowedRoles,
      }
    );
  }
}

module.exports = AccessManagement;
