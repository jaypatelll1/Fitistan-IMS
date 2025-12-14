const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { authenticateUser } = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/auth.validator");

// Public routes
router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  AuthController.refreshToken
);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  AuthController.resetPassword
);

// Protected routes
router.post("/logout", authenticateUser, AuthController.logout);
router.post(
  "/change-password",
  authenticateUser,
  validate(changePasswordSchema),
  AuthController.changePassword
);

module.exports = router;
