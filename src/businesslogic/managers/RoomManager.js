const RoomModel = require("../../models/RoomModel");

class RoomManager {

  // GET ALL ROOMS
  static async getAllRooms(userId) {
    try {
      const roomModel = new RoomModel(userId);
      const rooms = await roomModel.getAllRooms();
      return rooms; // array of rooms
    } catch (err) {
      // Database errors bubble up
      throw err;
    }
  }

  // GET ROOM BY ID
  static async getRoomById(id, userId) {
    try {
      const roomModel = new RoomModel(userId);
      const room = await roomModel.getRoomById(id);

      if (!room) {
        return {
          success: false,
          message: "Room not found or it has been deleted"
        };
      }

      return {
        success: true,
        data: room
      };
    } catch (err) {
      throw err;
    }
  }

  // CREATE ROOM
  static async createRoom(data, userId) {
    try {
      const roomModel = new RoomModel(userId);
      const room = await roomModel.createRoom(data);

      return {
        success: true,
        data: room,
        message: "Room created successfully"
      };
    } catch (err) {
      // Capture Model errors for duplicate / deleted room
      return {
        success: false,
        message: err.message
      };
    }
  }

  // UPDATE ROOM
  static async updateRoom(id, data, userId) {
    try {
      const roomModel = new RoomModel(userId);
      const room = await roomModel.updateRoom(id, data);

      if (!room) {
        return {
          success: false,
          message: "Room does not exist or no fields to update"
        };
      }

      if (room.is_deleted) {
        return {
          success: false,
          message: "Room is already deleted"
        };
      }

      return {
        success: true,
        data: room,
        message: "Room updated successfully"
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }

  // DELETE ROOM
  static async deleteRoom(id, userId) {
    try {
      const roomModel = new RoomModel(userId);
      const deleted = await roomModel.deleteRoom(id);

      if (!deleted) {
        return {
          success: false,
          message: "Room not found or already deleted"
        };
      }

      return {
        success: true,
        message: "Room deleted successfully"
      };
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  }
}

module.exports = RoomManager;
