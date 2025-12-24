require('dotenv').config();
const ShelfModel = require("../../models/shelfModel"); // ✅ Class name

class ShelfManager {

  static async getAllShelf(data) {
    try {
      console.log(data);

      const shelfModel = new ShelfModel(); 
      const shelf = await shelfModel.findAll();

      return shelf;
    } catch (err) {
      throw new Error(`Failed to fetch all shelfs: ${err.message}`);
    }
  };

  static async createShelf(data) {
    try {
      console.log(data);

      const shelfModel = new ShelfModel();
      const shelf = await shelfModel.create(data);

      return shelf;
    } catch (err) {
      throw new Error(`Failed to create shelf: ${err.message}`);
    }
  };  
  static async getShelfById(id) {
    try {
      const shelfModel = new ShelfModel();
      const shelf = await shelfModel.findById(id);
      if (!shelf) {
        return null;
      }
      return shelf;
    } catch (err) {
      throw new Error(`Failed to get shelf by ID: ${err.message}`);
    } 
  };

  static async updateShelf(id, data) {
    try {
      const shelfModel = new ShelfModel();
      const shelf = await shelfModel.update(id, data);
      if (!shelf) {
       return null;
      }
      return shelf;
    } catch (err) {
      throw new Error(`Failed to update shelf: ${err.message}`);
    }
  };

  static async deleteShelf(id) {
    try {
      const shelfModel = new ShelfModel();
      const shelf = await shelfModel.softDelete(id);
      if (!shelf) {
       return null;
      }
      return shelf;
    } catch (err) {
      throw new Error(`Failed to delete shelf: ${err.message}`);
    }
  };

}

module.exports = ShelfManager;
