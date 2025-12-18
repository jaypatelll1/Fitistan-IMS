const express = require("express");
const router = express.Router();

const RoomController = require("../controllers/room.controller");

// CREATE
router.post("/", RoomController.createRoom);

// READ
router.get("/", RoomController.getAllRooms);

// ✅ STATIC ROUTE FIRST
router.get("/dropdown/list", RoomController.getRoomIdName);

// ❗ DYNAMIC ROUTES LAST
router.get("/:id", RoomController.getRoomById);

// UPDATE
router.put("/:id", RoomController.updateRoom);

// DELETE
router.delete("/:id", RoomController.deleteRoom);

module.exports = router;
