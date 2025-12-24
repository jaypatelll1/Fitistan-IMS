const express = require("express");
const { appWrapper } = require("../routes/routeWrapper");
const UserController = require("../routes/controllers/user.router");


const router = express.Router({ mergeParams: true });


router.get(
  "/profile",
  
  appWrapper(async (req, res) => {
    const profile = await UserController.profile(req, res);

    return res.json({ data: profile });
  },[ACCESS_ROLES.ADMIN])
);

module.exports = router;
