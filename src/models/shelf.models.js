const knex = require("../db/knex");

class ShelfModel {
  static TABLE = "shelf";

  // Create shelf
  static create(data) {
    return knex(this.TABLE)
      .insert(data)
      .returning("*");
  }

  // Get all non-deleted shelves
  static getAll() {
    return knex(this.TABLE)
      .select("*")
      .where({ is_deleted: false });
  }

  // Get shelf by ID
  static getById(shelfId) {
    return knex(this.TABLE)
      .where({
        shelf_id: shelfId,
        is_deleted: false,
      })
      .first();
  }

  // Get shelves by warehouse
  static getByWarehouse(warehouseId) {
    return knex(this.TABLE)
      .where({
        warehouse_id: warehouseId,
        is_deleted: false,
      });
  }

  // Get shelves by room
  static getByRoom(roomId) {
    return knex(this.TABLE)
      .where({
        room_id: roomId,
        is_deleted: false,
      });
  }

  // Update shelf
  static update(shelfId, data, userId = null) {
    return knex(this.TABLE)
      .where({ shelf_id: shelfId })
      .update({
        ...data,
        last_modified_by: userId,
        updated_at: knex.fn.now(),
      })
      .returning("*");
  }

  // Soft delete shelf
  static softDelete(shelfId, userId = null) {
    return knex(this.TABLE)
      .where({ shelf_id: shelfId })
      .update({
        is_deleted: true,
        last_modified_by: userId,
        updated_at: knex.fn.now(),
      });
  }
}

module.exports = ShelfModel;
