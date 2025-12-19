// src/models/warehouse.model.js

const db = require("../config/database"); // ✅ USE DB, NOT knex package

const TABLE_NAME = "warehouses";

const WarehouseModel = {

  // CREATE
  async create(data) {
    const [warehouse] = await db(TABLE_NAME)
      .insert({
        name: data.name,
        location: data.location,
        capacity: data.capacity ?? 0,
      })
      .returning("*");

    return warehouse;
  },

  // GET ALL
  async findAll() {
    return db(TABLE_NAME).orderBy("warehouse_id", "desc");
  },

  // GET BY ID
  async findById(id) {
    return db(TABLE_NAME)
      .where({ warehouse_id: id })
      .first();
  },

  // UPDATE
  async update(id, data) {
    const [updated] = await db(TABLE_NAME)
      .where({ warehouse_id: id })
      .update({
        name: data.name,
        location: data.location,
        capacity: data.capacity,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return updated;
  },

  // DELETE
  async delete(id) {
    return db(TABLE_NAME)
      .where({ warehouse_id: id })
      .del();
  },
};

module.exports = WarehouseModel;
