

const RoomModel = require("../../models/RoomModel");



class RoomManager {

  static async getAllRooms(userId) {
    try {
      console.log(userId);

      const roomModel = new RoomModel();
      const room = await roomModel.getAllRooms();

      return room;
    } catch (err) {
      throw new Error(`Failed to fecth all rooms: ${err.message}`);
    }
  }

  static async getRoomById(id, userId) {

    try {
      const roomModel = new RoomModel(userId);
      const room = await roomModel.getRoomById(id);
      if (!room) {
        throw new Error(`Room not found or the room is deleted`);
      }
      return room;
    } catch (error) {
      throw new Error(`Failed to get room by ID: ${error.message}`);
    }

  }

static async createRoom(data, userId) {
  try {
    const roomModel = new RoomModel(userId);
    return await roomModel.createRoom(data);
  } catch (error) {
    throw new Error(error.message);
  }
}


  static async updateRoom(id, data, userId) {

    try {
      const roomModel = new RoomModel(userId);
      const room = await roomModel.updateRoom(id, data);

      if (!room) {
        throw new Error(`Room does not exist or no fields to update`);
      }

      if(room.is_deleted){
        throw new Error(`Room is already deleted`);
      }

      return room;

    } catch (error) {
      throw new Error(`Failed to update room: ${error.message}`);
    }
    
  }

  static async deleteRoom(id, userId) {
    try {
      const roomModel = new RoomModel(userId);
    const room = await roomModel.getRoomById(id);

    if (!room) {
      throw new Error(`Room not found`);
    }

    if (room.is_deleted) {
      throw new Error(`Room is already deleted`);
    }

    return roomModel.deleteRoom(id);
      
    } catch (error) {
     
      throw new Error(`Failed to delete room: ${error.message}`);
    }
    
  }
}

module.exports = RoomManager;
