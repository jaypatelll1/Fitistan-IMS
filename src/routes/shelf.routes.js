const express = require("express");
const router = express.Router();

const shelfController = require("../controllers/shelf.controller");

// Create shelf
router.post("/", shelfController.createShelf);

// Get all shelves
router.get("/", shelfController.getAllShelves);

// Get shelf by ID
router.get("/:id", shelfController.getShelfById);

// Get shelves by warehouse
router.get("/warehouse/:warehouseId", shelfController.getShelvesByWarehouse);

// Get shelves by room
router.get("/room/:roomId", shelfController.getShelvesByRoom);

// Update shelf
router.put("/:id", shelfController.updateShelf);

// Soft delete shelf
router.delete("/:id", shelfController.deleteShelf);

module.exports = router;
