// routes/warehouse.routes.js

const express = require("express");
const router = express.Router();

const WarehouseController = require("../../controllers/warehouse.controller");

// Create warehouse
router.post("/", WarehouseController.createWarehouse);

// List all warehouses
router.get("/", WarehouseController.getAllWarehouses);

// Get warehouse details
router.get("/:id", WarehouseController.getWarehouseById);

// Update warehouse
router.put("/:id", WarehouseController.updateWarehouse);

// Delete warehouse (soft delete)
router.delete("/:id", WarehouseController.deleteWarehouse);

// Get all rooms in warehouse
router.get("/:id/rooms", WarehouseController.getWarehouseRooms);

// Get capacity utilization stats
router.get("/:id/capacity", WarehouseController.getWarehouseCapacity);

// Get all inventory in warehouse
router.get("/:id/inventory", WarehouseController.getWarehouseInventory);

module.exports = router;
