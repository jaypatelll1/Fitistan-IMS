const  shelfModel = require("../models/shelf.model.js");

class shelfController {

    //create shelf
    static async createShelf(req, res) {
        try {
            const shelf = await shelfModel.create(req.body);
            res.status(201).json(shelf);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
    //get all shelves
    static async getAllShelves(req, res) {
        try {
            const shelves = await shelfModel.findAll();
            res.status(200).json(shelves);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    //get shelf by id
    static async getShelfById(req, res) {
        try {
            const shelf = await shelfModel.findById(req.params.id);
            if (!shelf) {
                return res.status(404).json({ message: "Shelf not found" });
            }
            res.status(200).json(shelf);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    //update shelf
    static async updateShelf(req, res) {
        try {
            const updatedShelf = await shelfModel.update(req.params.id, req.body);
            res.status(200).json(updatedShelf);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    //soft delete shelf
    static async deleteShelf(req, res) {
        try {
            await shelfModel.softDelete(req.params.id);
            res.status(200).json({ message: "Shelf deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}
module.exports = shelfController;