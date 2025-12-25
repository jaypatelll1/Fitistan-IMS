const express = require("express");
const router = express.Router();
const RoomController = require("../routes/controllers/RoomRouter");
const { appWrapper } = require("../routes/routeWrapper");

// GET ALL
router.get(
  "/all",
  appWrapper(RoomController.list)
);

// GET BY ID
router.get(
  "/:id",
  appWrapper(RoomController.get)
);

// CREATE
router.post(
  "/",
  appWrapper(RoomController.create)
);

// UPDATE
router.put(
  "/:id",
  appWrapper(RoomController.update)
);

// DELETE
router.delete(
  "/:id",
  appWrapper(RoomController.remove)
);

module.exports = router;
