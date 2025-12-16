// controllers/warehouse.controller.js

const knex = require("knex");
const Warehouse = require("../models/warehouse.model");

const WarehouseController = {

    // CREATE
    async createWarehouse(req, res) {
        try {
            const warehouse = await Warehouse.create({
                ...req.body,
                created_by: req.user?.user_id ?? null,
            });

            res.status(201).json({ success: true, data: warehouse });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // LIST ALL
    async getAllWarehouses(req, res) {
        try {
            const warehouses = await Warehouse.getAll();
            res.json({ success: true, data: warehouses });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // GET DETAILS
    async getWarehouseById(req, res) {
        try {
            const warehouse = await Warehouse.getById(req.params.id);

            if (!warehouse) {
                return res.status(404).json({ success: false, message: "Warehouse not found" });
            }

            res.json({ success: true, data: warehouse });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // UPDATE
    async updateWarehouse(req, res) {
        try {
            const updated = await Warehouse.update(req.params.id, {
                ...req.body,
                last_modified_by: req.user?.user_id ?? null,
            });

            res.json({ success: true, data: updated });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // DELETE SOFT
    async deleteWarehouse(req, res) {
        try {
            await Warehouse.softDelete(req.params.id, req.user?.user_id ?? null);
            res.json({ success: true, message: "Warehouse deleted" });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // GET ROOMS IN WAREHOUSE
    async getWarehouseRooms(req, res) {
        try {
            const rooms = await knex("public.rooms")
                .where({
                    warehouse_id: req.params.id,
                    is_deleted: false,
                });

            res.json({ success: true, data: rooms });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // CAPACITY UTILIZATION
    async getWarehouseCapacity(req, res) {
        try {
            const warehouse = await Warehouse.getById(req.params.id);
            if (!warehouse) {
                return res.status(404).json({ success: false, message: "Warehouse not found" });
            }

            const [{ used_capacity }] = await knex("inventory")
                .join("bins", "inventory.bin_id", "bins.bin_id")
                .join("shelves", "bins.shelf_id", "shelves.shelf_id")
                .join("rooms", "shelves.room_id", "rooms.room_id")
                .where("rooms.warehouse_id", req.params.id)
                .sum("inventory.quantity_on_hand as used_capacity");

            const used = Number(used_capacity || 0);
            const total = warehouse.capacity;

            res.json({
                success: true,
                data: {
                    total_capacity: total,
                    used_capacity: used,
                    available_capacity: total - used,
                    utilization_percent: total > 0 ? ((used / total) * 100).toFixed(2) : 0,
                },
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // INVENTORY IN WAREHOUSE
    async getWarehouseInventory(req, res) {
        try {
            const inventory = await knex("inventory")
                .select(
                    "inventory.inventory_id",
                    "inventory.quantity_on_hand",
                    "bins.bin_code",
                    "shelves.shelf_code",
                    "rooms.room_name"
                )
                .join("bins", "inventory.bin_id", "bins.bin_id")
                .join("shelves", "bins.shelf_id", "shelves.shelf_id")
                .join("rooms", "shelves.room_id", "rooms.room_id")
                .where("rooms.warehouse_id", req.params.id);

            res.json({ success: true, data: inventory });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
};

module.exports = WarehouseController;
