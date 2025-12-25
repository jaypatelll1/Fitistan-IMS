const express = require("express");
const { appWrapper } = require("../routeWrapper");
const  ACCESS_ROLES  = require("../../businesslogic/accessmanagement/RoleConstants");
const shelfManager = require("../../businesslogic/managers/ShelfManager");
const validateShelf = require("../../validators/shelfValidator");

const router = express.Router({ mergeParams: true });

router.get(
  "/get_all_shelfs",
  appWrapper(async () => {
    return {
      success: true,
      Shelfs: await shelfManager.getAllShelf()
    };
  }, [ACCESS_ROLES.ALL])
);

router.post(
  "/create_shelf",
  validateShelf("create"),
  appWrapper(async (req) => {
    return {
      success: true,
      shelf: await shelfManager.createShelf(req.validatedData),
      message: "Shelf created successfully"
    };
  }, [ACCESS_ROLES.ALL])
);

router.get(
  "/get_shelf/:id",
  validateShelf("id"),
  appWrapper(async (req) => {
    const shelf = await shelfManager.getShelfById(req.validatedData.id);
    return shelf
      ? { success: true, shelf: shelf }
      : { success: false, message: "Shelf not found or already deleted" };
  }, [ACCESS_ROLES.ALL])
);

router.put(
  "/update_shelf/:id",
  validateShelf("id"),
  validateShelf("update"),
  appWrapper(async (req) => {
    const shelf = await shelfManager.updateShelf(req.validatedData.id, req.validatedData.updateBody);
    return shelf
      ? { success: true, shelf: shelf, message: "Shelf updated successfully" }
      : { success: false, message: "Shelf not found or nothing to update" };
  }, [ACCESS_ROLES.ALL])
);

router.post(
  "/delete_shelf/:id",
  validateShelf("id"),
  appWrapper(async (req) => {
    const deleted = await shelfManager.deleteShelf(req.validatedData.id);
    return deleted
      ? { success: true, shelf: deleted ,message: "Shelf deleted successfully" }
      : { success: false, message: "Shelf not found or already deleted" };
  }, [ACCESS_ROLES.ALL])
);

module.exports = router;
