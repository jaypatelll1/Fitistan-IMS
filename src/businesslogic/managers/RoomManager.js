const RoomModel = require("../../models/room.model");

class RoomManager {

  static async getAllRooms(userId) {
    const roomModel = new RoomModel(userId);
    return roomModel.getAllRooms();
  }

  static async getRoomById(id, userId) {
    const roomModel = new RoomModel(userId);
    return roomModel.getRoomById(id);
  }

  static async createRoom(data, userId) {
    const roomModel = new RoomModel(userId);
    return roomModel.createRoom(data);
  }

  static async updateRoom(id, data, userId) {
    const roomModel = new RoomModel(userId);
    return roomModel.updateRoom(id, data);
  }

  static async deleteRoom(id, userId) {
    const roomModel = new RoomModel(userId);
    return roomModel.deleteRoom(id);
  }
}

module.exports = RoomManager;
