// models/warehouse.model.js

const knex = require("knex");

const TABLE_NAME = "public.warehouses";

const WarehouseModel = {

    // CREATE
    async create(data) {
        const [warehouse] = await knex(TABLE_NAME)
            .insert({
                name: data.name,
                location: data.location,
                capacity: data.capacity ?? 0,
                room_id: data.room_id ?? null,
                created_by: data.created_by ?? null,
            })
            .returning("*");

        return warehouse;
    },

    // GET ALL (only active & not deleted)
    async getAll() {
        return knex(TABLE_NAME)
            .where({
                is_deleted: false,
                is_active: true,
            })
            .orderBy("warehouse_id", "desc");
    },

   // GET BY ID
    async getById(warehouse_id) {
        return knex(TABLE_NAME)
            .where({
                warehouse_id,
                is_deleted: false,
            })
            .first();
    },

    // UPDATE
    async update(warehouse_id, data) {
        const [updated] = await knex(TABLE_NAME)
            .where({ warehouse_id })
            .update({
                name: data.name,
                location: data.location,
                capacity: data.capacity,
                room_id: data.room_id,
                last_modified_by: data.last_modified_by ?? null,
                updated_at: knex.fn.now(),
            })
            .returning("*");

        return updated;
    },

    // SOFT DELETE
    async softDelete(warehouse_id, user_id = null) {
        return knex(TABLE_NAME)
            .where({ warehouse_id })
            .update({
                is_deleted: true,
                is_active: false,
                last_modified_by: user_id,
                updated_at: knex.fn.now(),
            });
    },

    // ACTIVATE / DEACTIVATE
    async setActiveStatus(warehouse_id, is_active, user_id = null) {
        return knex(TABLE_NAME)
            .where({ warehouse_id })
            .update({
                is_active,
                last_modified_by: user_id,
                updated_at: knex.fn.now(),
            });
    },
};

module.exports = WarehouseModel;
