const BaseModel = require("../models/libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class WarehouseModel extends BaseModel {
  constructor(userId) {
    super(userId);
  }

async findWarehouseById(id) {
  const qb = await this.getQueryBuilder();
  return qb("warehouses")
    .where({ warehouse_id: id, is_deleted: false })
    .first();
}

async findRoomById(id) {
  const qb = await this.getQueryBuilder();
  return qb("rooms")
    .where({ room_id: id })
    .first();
}

async findShelfById(id) {
  const qb = await this.getQueryBuilder();
  return qb("shelf")
    .where({ shelf_id: id })
    .first();
}


}

module.exports = WarehouseModel;