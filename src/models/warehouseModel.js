const BaseModel = require("../models/libs/BaseModel");


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

  async getWarehouseDetailsByIds({ warehouse_id, room_id, shelf_id }) {
    const qb = await this.getQueryBuilder();

    let query = qb("warehouses as w")
      .select(
        "w.warehouse_id",
        "w.name",
        "r.room_id",
        "r.room_name",
        "s.shelf_id",
        "s.shelf_name",
        "s.capacity"
      )
      .leftJoin("rooms as r", "r.warehouse_id", "w.warehouse_id")
      .leftJoin("shelf as s", "s.room_id", "r.room_id")
      .where("w.warehouse_id", warehouse_id)
      .where("w.is_deleted", false);

    if (room_id) {
      query.andWhere("r.room_id", room_id);
    }

    if (shelf_id) {
      query.andWhere("s.shelf_id", shelf_id);
    }

    return query;
  }



  async getAllWarehousesPaginated(page = 1, limit = 10) {
    try {
      const qb = await this.getQueryBuilder();
      const offset = (page - 1) * limit;

      const warehouses = await qb("warehouses")
        .select("*")
        .where("is_deleted", false)
        .orderBy("warehouse_id", "desc")
        .limit(limit)
        .offset(offset);

      const [{ count }] = await qb("warehouses")
        .where("is_deleted", false)
        .count("* as count");

      return {
        data: warehouses,
        total: Number(count)
      };
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

}

module.exports = WarehouseModel;