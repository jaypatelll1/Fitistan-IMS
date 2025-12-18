const db = require("../config/database");

class RoomModel {
  // Get all rooms (with optional filters)
  static async findAll(filters = {}) {
    let query = db("rooms").select("*");

    if (filters.warehouse_id) {
      query = query.where({ warehouse_id: filters.warehouse_id });
    }

    if (filters.is_active !== undefined) {
      query = query.where({ is_active: filters.is_active });
    }

    return query.orderBy("created_at", "desc");
  }

  // Get room by ID
  static async findById(roomId) {
    return db("rooms").where({ room_id: roomId }).first();
  }

  // Get room by code
  static async findByCode(roomCode) {
    return db("rooms").where({ room_code: roomCode }).first();
  }

  // Create new room
  static async create(roomData) {
    const [room] = await db("rooms")
      .insert(roomData)
      .returning("*");
    return room;
  }

  // Update room
  static async update(roomId, roomData) {
    const [room] = await db("rooms")
      .where({ room_id: roomId })
      .update({ ...roomData, updated_at: db.fn.now() })
      .returning("*");
    return room;
  }

  // Update room active status
  static async updateStatus(roomId, isActive) {
    return this.update(roomId, { is_active: isActive });
  }

  // Deactivate room (soft delete)
  static async deactivate(roomId) {
    return this.updateStatus(roomId, false);
  }

  // Get rooms by warehouse
  static async findByWarehouse(warehouseId) {
    return db("rooms")
      .where({ warehouse_id: warehouseId, is_active: true })
      .orderBy("room_name", "asc");
  }
  // GET ONLY ROOM ID & NAME
static async findIdAndName() {
  return db("rooms")
    .select("room_id", "room_name")
    .where({ is_active: true })
    .orderBy("room_name", "asc");
}

}

module.exports = RoomModel;
