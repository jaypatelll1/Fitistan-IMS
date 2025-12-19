const express = require("express");
const { successResponseAppWrapper, appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businesslogic/accessmanagement/roleConstants");
const AuthenticationManager = require("../../businesslogic/managers/AuthenticationManager");

const router = express.Router({ mergeParams: true });


router.post("/login", appWrapper(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
     
      const loginResult = await AuthenticationManager.login({ email, password });

      // Return JWT + user info
      return res.json({
        success: true,
        jwt_token: loginResult.jwt_token,
        user: loginResult.user
      });
    } catch (err) {
      // Handle authentication errors
      return res.status(401).json({
        success: false,
        error: err.message || "Invalid email or password"
      });
    }
  }, [ACCESS_ROLES.ALL])
);

module.exports = router;

