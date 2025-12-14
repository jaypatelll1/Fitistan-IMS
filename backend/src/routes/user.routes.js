// src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const {
  authenticateUser,
  attachUserInfo,
  isAdmin,
  isAdminOrManager,
} = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const {
  updateRoleSchema,
  updateStatusSchema,
} = require("../validators/user.validator");

// All routes require authentication
router.use(authenticateUser, attachUserInfo);

// Current user profile (any authenticated user)
router.get("/profile", UserController.getProfile);

// Admin/Manager only routes
router.get("/", isAdminOrManager, UserController.getAll);
router.get("/:id", isAdminOrManager, UserController.getById);

// Admin only routes
router.patch(
  "/:id/role",
  isAdmin,
  validate(updateRoleSchema),
  UserController.updateRole
);
router.patch(
  "/:id/status",
  isAdmin,
  validate(updateStatusSchema),
  UserController.updateStatus
);
router.delete("/:id", isAdmin, UserController.deactivate);

module.exports = router;
