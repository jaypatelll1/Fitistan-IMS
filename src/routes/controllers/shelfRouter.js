const express = require("express");
const { appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businesslogic/accessmanagement/roleConstants");
const shelfManager = require("../../businesslogic/managers/ShelfManager");
const validateShelf = require("../../validators/shelfValidator");

const router = express.Router({ mergeParams: true });

router.get(
  "/manage/all",
  appWrapper(async () => {
    return {
      success: true,
      data: await shelfManager.getAllShelf()
    };
  }, [ACCESS_ROLES.ALL])
);

router.post(
  "/manage/create",
  validateShelf("create"),
  appWrapper(async (req) => {
    return {
      success: true,
      data: await shelfManager.createShelf(req.validatedData),
      message: "Shelf created successfully"
    };
  }, [ACCESS_ROLES.ALL])
);

router.get(
  "/manage/:id",
  validateShelf("id"),
  appWrapper(async (req) => {
    const shelf = await shelfManager.getShelfById(req.validatedData.id);
    return shelf
      ? { success: true, data: shelf }
      : { success: false, message: "Shelf not found or already deleted" };
  }, [ACCESS_ROLES.ALL])
);

router.put(
  "/manage/update/:id",
  validateShelf("id"),
  validateShelf("update"),
  appWrapper(async (req) => {
    const shelf = await shelfManager.updateShelf(req.validatedData.id, req.validatedData.updateBody);
    return shelf
      ? { success: true, data: shelf, message: "Shelf updated successfully" }
      : { success: false, message: "Shelf not found or nothing to update" };
  }, [ACCESS_ROLES.ALL])
);

router.post(
  "/manage/delete/:id",
  validateShelf("id"),
  appWrapper(async (req) => {
    const deleted = await shelfManager.deleteShelf(req.validatedData.id);
    return deleted
      ? { success: true, message: "Shelf deleted successfully" }
      : { success: false, message: "Shelf not found or already deleted" };
  }, [ACCESS_ROLES.ALL])
);

module.exports = router;
