const express = require("express");
const AuthenticationManager = require("../../businesslogic/managers/AuthenticationManager");
const { registerSchema, loginSchema } = require("../../validators/AuthValidator");

const router = express.Router();

// REGISTER
router.post("/register", registerSchema, async (req, res, next) => {
  try {
    const user = await AuthenticationManager.register(req.body);
    return res.json({
      success: true,
      data: user,
      message: "Registration successful"
    });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", loginSchema, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthenticationManager.login(email, password);
    return res.json({
      success: true,
      data: result,
      message: "Login successful"
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
