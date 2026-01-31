const WarehouseModel = require("../../models/WarehouseModel");
const ValidationError = require("../../errorhandlers/ValidationError");

class WarehouseManager {

  static async getWarehouseDetailsByIds(ids, userId, page, limit) {
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

    // 4️⃣ Fetch paginated data
    const result = await model.getWarehouseDetailsByIds(
      ids,
      page,
      limit
    );

    const totalPages = Math.ceil(result.total / limit);
    const offset = (page - 1) * limit;

    return {
      data: result.data,
      total: result.total,
      page,
      limit,
      offset,
      totalPages,
      previous: page > 1 ? page - 1 : null,
      next: page < totalPages ? page + 1 : null
    };
  }
  static async getAllWarehousesPaginated(page, limit, userId) {
    const model = new WarehouseModel(userId);
    const result = await model.getAllWarehousesPaginated(page, limit);

    return {
      warehouses: result.data,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  static async getWarehouseById(id, userId) {
    const model = new WarehouseModel(userId);
    const warehouse = await model.findWarehouseById(id);

    if (!warehouse) {
      throw new ValidationError({
        details: [{
          path: ["warehouse_id"],
          message: "Warehouse not found"
        }]
      });
    }

    return warehouse;
  }

  static async createWarehouse(data, userId) {
    const { name, location } = data;

    if (!name || name.trim() === '') {
      throw new ValidationError({
        details: [{
          path: ["name"],
          message: "Warehouse name is required"
        }]
      });
    }

    const model = new WarehouseModel(userId);
    const warehouse = await model.create({ name, location });

    return warehouse;
  }

  static async updateWarehouse(id, data, userId) {
    const model = new WarehouseModel(userId);

    // Validate warehouse exists
    const existing = await model.findWarehouseById(id);
    if (!existing) {
      throw new ValidationError({
        details: [{
          path: ["warehouse_id"],
          message: "Warehouse not found"
        }]
      });
    }

    const warehouse = await model.update(id, data);
    return warehouse;
  }

  static async deleteWarehouse(id, userId) {
    const model = new WarehouseModel(userId);

    // Validate warehouse exists
    const existing = await model.findWarehouseById(id);
    if (!existing) {
      throw new ValidationError({
        details: [{
          path: ["warehouse_id"],
          message: "Warehouse not found"
        }]
      });
    }

    const warehouse = await model.softDelete(id);
    return warehouse;
  }
}

module.exports = WarehouseManager;
