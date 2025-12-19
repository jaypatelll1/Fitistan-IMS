

const db = require("../config/database");

class shelfModel {

   static async findAll() {
        return db("shelf")
            .select("*")
            .where({ is_deleted: false });
    }

   static async findById(shelf_id) {
        return db("shelf")
            .where({ shelf_id, is_deleted: false })
            .first();
    }

   static async create(shelfData) {
        const [shelf] = await db("shelf")
            .insert(shelfData)
            .returning("*");
        return shelf;
    }

   static async update(shelf_id, shelfData) {
        const [updatedShelf] = await db("shelf")
            .where({ shelf_id, is_deleted: false })
            .update(shelfData)
            .returning("*");
        return updatedShelf;
    }

   static async softDelete(shelf_id) {
        return db("shelf")
            .where({ shelf_id })
            .update({ is_deleted: true });
    }
}

module.exports = shelfModel;
