const express = require("express");
const router = express.Router();
const AuthController = require("../routes/controllers/Authrouter");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

// 🔓 PUBLIC ROUTES
router.post("/register", registerSchema, AuthController.register);
router.post("/login", loginSchema, AuthController.login);

module.exports = router;
