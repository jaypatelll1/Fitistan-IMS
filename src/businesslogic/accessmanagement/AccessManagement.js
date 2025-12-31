const  {ACCESS_ROLES}  = require("../accessmanagement/RoleConstants");
const USER_ROLES_INFO = require("../../models/libs/seedConstants");
const AccessPermissionError = require("../../errorhandlers/AccessPermissionError");

class AccessManagement {
  static checkIfAccessGrantedOrThrowError = (allowedRoles = [], { roles }) => {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new AccessPermissionError();
    }

    // Normalize role names from DB for safe comparison
    const roleNames = roles
      .map(r => r?.role_name?.trim().toLowerCase())
      .filter(Boolean);

    // Grant access if allowedRoles includes ALL or ACCOUNT_SELF_MEMBER
    if (allowedRoles.includes(ACCESS_ROLES.ALL) ) {
      return true;
    }

    // Admin check (case-insensitive)
    if (
      allowedRoles.includes(ACCESS_ROLES.ACCOUNT_ADMIN) &&
      roleNames.includes(USER_ROLES_INFO.ADMIN.NAME.trim().toLowerCase())
    ) {
      return true;
    }

    // Super Admin check (case-insensitive)
    if (
      allowedRoles.includes(ACCESS_ROLES.ACCOUNT_SUPER_ADMIN) &&
      roleNames.includes(USER_ROLES_INFO.SUPER_ADMIN.NAME.trim().toLowerCase())
    ) {
      return true;
    }

    // If none of the above match, throw permission error
    throw new AccessPermissionError();
  };
}

module.exports = AccessManagement;
