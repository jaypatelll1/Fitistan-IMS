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

const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;

const result = await WarehouseManager.getWarehouseDetailsByIds(
  req.body,
  userId,
  page,
  limit
);

return {
  success: true,
  data: result.data,
  pagination: {
    page: result.page,
    limit: result.limit,
    offset: result.offset,
    total: result.total,
    totalPages: result.totalPages,
    previous: result.previous,
    next: result.next
  }
};
  
    // const data = await WarehouseManager.getWarehouseDetailsByIds(
    //   req.body,
    //   userId
    // );

    return {
      success: true,
      data
    };
  }, [ACCESS_ROLES.ACCOUNT_ADMIN, ACCESS_ROLES.ACCOUNT_SUPER_ADMIN])
);

// GET ALL WAREHOUSES
router.get(
  "/get_all_warehouses",
  appWrapper(async (req) => {
    const userId = req.locals?.user?.user_id
      || req._locals?.user?.user_id
      || req.auth?.user_id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await WarehouseManager.getAllWarehousesPaginated(
      page,
      limit,
      userId
    );

    return {
      success: true,
      data: result.warehouses,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    };
  }, [ACCESS_ROLES.ALL])
);



module.exports = router;
