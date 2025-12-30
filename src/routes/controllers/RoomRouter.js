const express = require("express");
const { appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businesslogic/accessmanagement/roleConstants");
const roomManager = require("../../businesslogic/managers/RoomManager");
const { RES_LOCALS } = require("../middleware/constant");

const router = express.Router({ mergeParams: true });


router.get(
  "/get_all_rooms",
  appWrapper(
    async (req, res) => {
      const userId = res.locals[RES_LOCALS.USER_INFO.KEY].user.user_id;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await roomManager.getAllRoomsPaginated(
        userId,
        page,
        limit
      );

      if (!result.rooms || result.rooms.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No rooms found"
        });
      }

      return {
        success: true,
        rooms: result.rooms,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          offset: result.offset,
          previous: result.previous,
          next: result.next
        },
        message: "Rooms fetched successfully"
      };
    },
    [ACCESS_ROLES.ALL]
  )
);


router.post(
  "/create_room",
  appWrapper(
    async (req, res) => {
      const userId = res.locals[RES_LOCALS.USER_INFO.KEY].user.user_id;
      const room = await roomManager.createRoom(req.body, userId);

      return {

        room: room

      };
    },
    [ACCESS_ROLES.ACCOUNT_ADMIN, ACCESS_ROLES.ACCOUNT_SUPER_ADMIN]
  )
);


router.get(
  "/get_room/:id",
  appWrapper(
    async (req, res) => {
      const userId = res.locals[RES_LOCALS.USER_INFO.KEY].user.user_id;
      const { id } = req.params;

      const room = await roomManager.getRoomById(id, userId);

      return {

        room: room

      };
    },
    [ACCESS_ROLES.ACCOUNT_ADMIN, ACCESS_ROLES.ACCOUNT_SUPER_ADMIN]
  )
);


router.put(
  "/update_room/:id",
  appWrapper(
    async (req, res) => {
      const userId = res.locals[RES_LOCALS.USER_INFO.KEY].user.user_id;
      const { id } = req.params;

      const updatedRoom = await roomManager.updateRoom(
        id,
        req.body,
        userId
      );

      return {

        updated_room: updatedRoom

      };
    },
    [ACCESS_ROLES.ACCOUNT_ADMIN, ACCESS_ROLES.ACCOUNT_SUPER_ADMIN]
  )
);


router.delete(
  "/delete_room/:id",
  appWrapper(
    async (req, res) => {
      const userId = res.locals[RES_LOCALS.USER_INFO.KEY].user.user_id;
      const { id } = req.params;

      const result = await roomManager.deleteRoom(id, userId);

      return {

        deleted_room: result,
        message: "Room deleted successfully"
      };
    },
    [ACCESS_ROLES.ACCOUNT_ADMIN]
  )
);

module.exports = router;
