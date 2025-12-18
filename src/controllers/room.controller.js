const Room = require("../models/room.model");

class RoomController {

  // CREATE ROOM
  static async createRoom(req, res) {
    try {
      const roomData = req.body;

      const existingRooms = await Room.findAll({
        warehouse_id: roomData.warehouse_id,
        is_active: true
      });

      const duplicate = existingRooms.find(
        r => r.room_name.toLowerCase() === roomData.room_name.toLowerCase()
      );

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Room with this name already exists"
        });
      }

      const room = await Room.create(roomData);

      return res.status(201).json({
        success: true,
        data: room
      });

    } catch (error) {
      console.error("CREATE ROOM ERROR 👉", error.message);
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET ALL ROOMS
  static async getAllRooms(req, res) {
    try {
      const rooms = await Room.findAll(req.query);
      res.json({ success: true, data: rooms });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

  // GET ROOM BY ID
  static async getRoomById(req, res) {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }
      res.json({ success: true, data: room });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

  // UPDATE ROOM
  static async updateRoom(req, res) {
    try {
      const updated = await Room.update(req.params.id, req.body);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

  // SOFT DELETE ROOM
  static async deleteRoom(req, res) {
    try {
      await Room.deactivate(req.params.id);
      res.json({
        success: true,
        message: "Room deactivated"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }

  // DROPDOWN API
  static async getRoomIdName(req, res) {
    try {
      const rooms = await Room.findIdAndName();
      res.json({
        success: true,
        data: rooms
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }
}

module.exports = RoomController;
