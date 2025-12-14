// src/middleware/auth.middleware.js
const { clerkClient, requireAuth } = require("@clerk/express");
const logger = require("../utils/logger");
const ResponseHandler = require("../utils/responseHandler");
const db = require("../config/database");

/**
 * Authenticate user using Clerk
 */
const authenticateUser = requireAuth({
  onError: (error) => {
    logger.error("Authentication error:", error.message);
  },
});

/**
 * Sync Clerk user with local database and attach user info
 */
const attachUserInfo = async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      logger.warn("No userId found in request auth");
      return ResponseHandler.unauthorized(res, "Authentication required");
    }

    const clerkUserId = req.auth.userId;

    // Check if user exists in our database
    let user = await db("users").where({ clerk_user_id: clerkUserId }).first();

    // If user doesn't exist, fetch from Clerk and create in our DB
    if (!user) {
      logger.info(`First time login for Clerk user: ${clerkUserId}`);

      const clerkUser = await clerkClient.users.getUser(clerkUserId);

      // Create user in our database
      const [newUser] = await db("users")
        .insert({
          clerk_user_id: clerkUserId,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          first_name: clerkUser.firstName,
          last_name: clerkUser.lastName,
          role: "staff", // Default role
          status: "active",
          last_login: db.fn.now(),
        })
        .returning("*");

      user = newUser;
      logger.info(`✅ New user created: ${user.email} (${user.user_id})`);
    } else {
      // Update last login
      await db("users")
        .where({ user_id: user.user_id })
        .update({ last_login: db.fn.now() });
    }

    // Check if user is active
    if (user.status !== "active") {
      logger.warn(`Inactive user attempted login: ${user.email}`);
      return ResponseHandler.unauthorized(
        res,
        "Your account is inactive. Please contact administrator."
      );
    }

    // Attach user info to request
    req.user = {
      id: user.user_id,
      clerkId: user.clerk_user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      role: user.role,
      status: user.status,
    };

    logger.info(`✅ User authenticated: ${req.user.email} [${req.user.role}]`);
    next();
  } catch (error) {
    logger.error("Error in attachUserInfo middleware:", error);
    return ResponseHandler.error(res, "Authentication failed", 500);
  }
};

/**
 * Role-based authorization middleware
 * @param {Array} allowedRoles - Array of roles that can access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseHandler.unauthorized(res, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access attempt by ${req.user.email} [${req.user.role}] to ${req.path}`
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

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return ResponseHandler.error(res, "Admin access required", 403);
  }
  next();
};

/**
 * Check if user is admin or manager
 */
const isAdminOrManager = (req, res, next) => {
  if (!["admin", "manager"].includes(req.user?.role)) {
    return ResponseHandler.error(res, "Admin or Manager access required", 403);
  }
  next();
};

module.exports = {
  authenticateUser,
  attachUserInfo,
  authorize,
  isAdmin,
  isAdminOrManager,
};
