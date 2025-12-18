const express = require("express");
const router = express.Router();
const WarehouseController = require("../controllers/warehouse.controller");

// CREATE
router.post("/", WarehouseController.createWarehouse);

// READ
router.get("/", WarehouseController.getAllWarehouses);
router.get("/:id", WarehouseController.getWarehouseById);

// UPDATE
router.put("/:id", WarehouseController.updateWarehouse);

// DELETE (SOFT)
router.delete("/:id", WarehouseController.deleteWarehouse);

// EXTRA
router.get("/:id/rooms", WarehouseController.getWarehouseRooms);
router.get("/:id/capacity", WarehouseController.getWarehouseCapacity);
router.get("/:id/inventory", WarehouseController.getWarehouseInventory);

module.exports = router;
