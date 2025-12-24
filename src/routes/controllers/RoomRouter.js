const express = require("express");
const router = express.Router({ mergeParams: true });
const { appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businesslogic/accessmanagement/roleConstants");
const roomManager = require("../../businesslogic/managers/RoomManager");
const validateRoom = require("../../validators/RoomValidator");

// GET ALL ROOMS
router.get(
  "/manage/all",
  appWrapper(async (req, res) => {
    const rooms = await roomManager.getAllRooms();
    return { success: true, data: rooms };
  }, [ACCESS_ROLES.ACCOUNT_ADMIN])
);

// CREATE ROOM
router.post(
  "/manage/create",
  validateRoom("create"),
  appWrapper(async (req, res) => {
    const room = await roomManager.createRoom(req.validatedData);
    return { success: true, data: room, message: "Room created successfully" };
  }, [ACCESS_ROLES.ACCOUNT_ADMIN])
);

// GET ROOM BY ID
router.get(
  "/manage/:id",
  validateRoom("id"),
  appWrapper(async (req, res) => {
    const { id } = req.validatedData;
    const room = await roomManager.getRoomById(id);
    return { success: true, data: room };
  }, [ACCESS_ROLES.ACCOUNT_ADMIN])
);

// UPDATE ROOM
router.put(
  "/manage/update/:id",
  validateRoom("update"),
  appWrapper(async (req, res) => {
    const { id } = req.params;
    const room = await roomManager.updateRoom(id, req.validatedData.updateBody);
     return res.json({
      success: true,
      data: room,
      message: "Room updated successfully",
    });
  }, [ACCESS_ROLES.ACCOUNT_ADMIN])
);




// DELETE ROOM
router.delete(
  "/manage/delete/:id",
  validateRoom("id"),
  appWrapper(async (req, _res) => {
    const { id } = req.validatedData;
    const result = await roomManager.deleteRoom(id);
    return { success: true, data: result, message: "Room deleted successfully" };
  }, [ACCESS_ROLES.ACCOUNT_ADMIN])
);

module.exports = router;
