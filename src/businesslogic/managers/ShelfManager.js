require('dotenv').config();
const ShelfModel = require("../../models/shelfModel");
const RoomModel = require("../../models/RoomModel");
const ValidationError = require("../../errorhandlers/ValidationError");

class ShelfManager {

  static async getAllShelf() {
    const shelfModel = new ShelfModel();
    return await shelfModel.getAllShelf();
  }

  static async createShelf(data) {
    const roomModel = new RoomModel();
    

    // Check room exists and not deleted
    const room = await roomModel.getRoomById(data.room_id);
    
    if (!room) {
      throw new ValidationError({
        details: [
          {
            path: ["room_id"],
            message: "Cannot create shelf in a deleted or non-existing room"
          }
        ]
      });
    }

    

    const shelfModel = new ShelfModel();
    return await shelfModel.createShelf(data);
  }

  static async getShelfById(id) {
    const shelfModel = new ShelfModel();
    return await shelfModel.getShelfById(id);
  }

  static async updateShelf(id, data) {
    const shelfModel = new ShelfModel();
    return await shelfModel.updateShelf(id, data);
  }

  static async deleteShelf(id) {
    const shelfModel = new ShelfModel();
    return await shelfModel.deleteShelf(id);
  }
}

module.exports = ShelfManager;
