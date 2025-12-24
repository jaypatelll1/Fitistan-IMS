const WarehouseModel = require("../../models/WarehouseModel");
const ValidationError = require("../../errorhandlers/ValidationError");

class WarehouseManager {

  static async getWarehouseDetailsByIds(ids, userId) {
    const { warehouse_id, room_id, shelf_id } = ids;
    const model = new WarehouseModel(userId);

    // 1️⃣ Warehouse validation
    const warehouse = await model.findWarehouseById(warehouse_id);
    if (!warehouse) {
      throw new ValidationError({
        details: [{
          path: ["warehouse_id"],
          message: "Warehouse not found or deleted"
        }]
      });
    }

    // 2️⃣ Room validation
    let room = null;
    if (room_id) {
      room = await model.findRoomById(room_id);

      if (!room || room.is_deleted) {
        throw new ValidationError({
          details: [{
            path: ["room_id"],
            message: "Room not found or deleted"
          }]
        });
      }

      if (room.warehouse_id !== warehouse_id) {
        throw new ValidationError({
          details: [{
            path: ["room_id"],
            message: "Room does not belong to given warehouse"
          }]
        });
      }
    }

    // 3️⃣ Shelf validation
    if (shelf_id) {
      const shelf = await model.findShelfById(shelf_id);

      if (!shelf || shelf.is_deleted) {
        throw new ValidationError({
          details: [{
            path: ["shelf_id"],
            message: "Shelf not found or deleted"
          }]
        });
      }

      if (!room || shelf.room_id !== room_id) {
        throw new ValidationError({
          details: [{
            path: ["shelf_id"],
            message: "Shelf does not belong to given room"
          }]
        });
      }
    }

    // 4️⃣ Fetch joined data
    return await model.getWarehouseByIds(ids);
  }
}

module.exports = WarehouseManager;
