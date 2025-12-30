const express = require("express");
const router = express.Router({ mergeParams: true });
const { appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businesslogic/accessmanagement/roleConstants");
const WarehouseManager = require("../../businesslogic/managers/WarehouseManager");

// GET WAREHOUSE → ROOMS → SHELVES
router.post(
  "/manage/by-ids",
  appWrapper(async (req) => {
    const userId = req.locals?.user?.user_id
      || req._locals?.user?.user_id
      || req.auth?.user_id;

    const data = await WarehouseManager.getWarehouseDetailsByIds(
      req.body,
      userId
    );

    return {
      success: true,
      data
    };
  }, [ACCESS_ROLES.ACCOUNT_ADMIN, ACCESS_ROLES.ACCOUNT_SUPER_ADMIN])
);



module.exports = router;
