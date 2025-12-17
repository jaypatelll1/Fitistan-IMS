const JWTHelper = require("../utils/jwtHelper");
const ResponseHandler = require("../utils/responseHandler");
const logger = require("../utils/logger");
const db = require("../config/database");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ResponseHandler.unauthorized(res, "No token provided");
    }

    const token = authHeader.substring(7);
    const decoded = JWTHelper.verifyToken(token);

    // Check if user exists and is active
    const user = await db("users").where({ user_id: decoded.id }).first();

    if (!user) {
      return ResponseHandler.unauthorized(res, "User not found");
    }

    if (user.status !== "active") {
      return ResponseHandler.unauthorized(res, "Account is inactive");
    }

    // Check if password was changed after token was issued
    if (user.password_changed_at) {
      const changedTimestamp = parseInt(
        user.password_changed_at.getTime() / 1000,
        10
      );
      if (decoded.iat < changedTimestamp) {
        return ResponseHandler.unauthorized(
          res,
          "Password recently changed. Please login again"
        );
      }
    }

    // Attach user to request
    req.user = {
      id: user.user_id,
      email: user.email,
      Name: user.name,
      fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      role: user.role,
      status: user.status,
      emailVerified: user.email_verified,
    };

    next();
  } catch (error) {
    logger.error("Authentication error:", error.message);
    if (error.message === "Token expired") {
      return ResponseHandler.unauthorized(res, "Token expired");
    }
    return ResponseHandler.unauthorized(res, "Invalid token");
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHandler.unauthorized(res, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access by ${req.user.email} [${req.user.role}] to ${req.path}`
      );
      return ResponseHandler.error(
        res,
        `Access denied. Required roles: ${allowedRoles.join(", ")}`,
        403
      );
    }

    next();
  };
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return ResponseHandler.error(res, "Admin access required", 403);
  }
  next();
};

const isAdminOrManager = (req, res, next) => {
  if (!["admin", "manager"].includes(req.user?.role)) {
    return ResponseHandler.error(res, "Admin or Manager access required", 403);
  }
  next();
};

module.exports = {
  authenticateUser,
  authorize,
  isAdmin,
  isAdminOrManager,
};
