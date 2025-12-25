const express = require("express");
const AuthenticationManager = require("../../businesslogic/managers/AuthenticationManager");
const { appWrapper } = require("../routeWrapper");
const ACCESS_ROLES = require("../../businesslogic/accessmanagement/RoleConstants");

const router = express.Router();

// REGISTER
router.post(
  "/register_user",
  appWrapper(
    async (req, res) => {
      const user = await AuthenticationManager.register(req.body);

      return res.json({
        success: true,
        user: user,
        message: "Registration successful"
      });
    },
    [ACCESS_ROLES.ACCOUNT_SUPER_ADMIN]
  )
);

module.exports = router;




