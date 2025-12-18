const Warehouse = require("../models/warehouse.model");

class WarehouseController {

  // CREATE WAREHOUSE
  static async createWarehouse(req, res) {
    try {
      const warehouse = await Warehouse.create(req.body);

      res.status(201).json({
        success: true,
        message: "Warehouse created successfully",
        data: warehouse
      });
    } catch (error) {
      console.error("Create warehouse error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating warehouse"
      });
    }
  }

  // GET ALL WAREHOUSES
  static async getAllWarehouses(req, res) {
    try {
      const warehouses = await Warehouse.findAll();

      res.status(200).json({
        success: true,
        data: warehouses
      });
    } catch (error) {
      console.error("Get warehouses error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching warehouses"
      });
    }
  }

  // GET WAREHOUSE BY ID
  static async getWarehouseById(req, res) {
    try {
      const warehouse = await Warehouse.findById(req.params.id);

      if (!warehouse) {
        return res.status(404).json({
          success: false,
          message: "Warehouse not found"
        });
      }

      res.status(200).json({
        success: true,
        data: warehouse
      });
    } catch (error) {
      console.error("Get warehouse error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching warehouse"
      });
    }
  }

  // UPDATE WAREHOUSE
  static async updateWarehouse(req, res) {
    try {
      const updated = await Warehouse.update(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Warehouse updated successfully",
        data: updated
      });
    } catch (error) {
      console.error("Update warehouse error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating warehouse"
      });
    }
  }

  // DELETE WAREHOUSE (SOFT)
  static async deleteWarehouse(req, res) {
    try {
      await Warehouse.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Warehouse deleted successfully"
      });
    } catch (error) {
      console.error("Delete warehouse error:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting warehouse"
      });
    }
  }

  // GET ROOMS IN WAREHOUSE
  static async getWarehouseRooms(req, res) {
    try {
      const rooms = await Warehouse.getRooms(req.params.id);

      res.status(200).json({
        success: true,
        data: rooms
      });
    } catch (error) {
      console.error("Get warehouse rooms error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching rooms"
      });
    }
  }

  // CAPACITY STATS
  static async getWarehouseCapacity(req, res) {
    try {
      const stats = await Warehouse.getCapacityStats(req.params.id);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error("Capacity error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching capacity"
      });
    }
  }

  // INVENTORY
  static async getWarehouseInventory(req, res) {
    try {
      const inventory = await Warehouse.getInventory(req.params.id);

      res.status(200).json({
        success: true,
        data: inventory
      });
    } catch (error) {
      console.error("Inventory error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching inventory"
      });
    }
  }
}

module.exports = WarehouseController;
