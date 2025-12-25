const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class ShelfModel extends BaseModel {
    constructor(userId) {
        super(userId);
    }

    async getAllShelf() {
        try {
            const qb = await this.getQueryBuilder();
            return await qb("shelf").select("*").where(this.whereStatement({})).orderBy("shelf_id", "asc");
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async createShelf(data) {
        try {
            const qb = await this.getQueryBuilder();
            const insertData = this.insertStatement(data);
            const [shelf] = await qb("shelf").insert(insertData).returning("*");
            
            return shelf;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async getShelfById(id) {
        try {
            const qb = await this.getQueryBuilder();
            const shelf = await qb("shelf").select("*").where(this.whereStatement({ shelf_id: id })).first();
            return shelf || null;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async updateShelf(id, data) {
        try {
            const qb = await this.getQueryBuilder();
            const updateData = this.insertStatement(data);
            const exists = await qb("shelf").select("shelf_id").where(this.whereStatement({ shelf_id: id })).first();
            if (!exists) return null;
            const [shelf] = await qb("shelf").update(updateData).where(this.whereStatement({ shelf_id: id })).returning("*");
            return shelf;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async   deleteShelf(id) {
        try {
            const qb = await this.getQueryBuilder();
            const exists = await qb("shelf").select("shelf_id").where(this.whereStatement({ shelf_id: id })).first();
            if (!exists) return null;
            const [shelf] = await qb("shelf").update({ is_deleted: true }).where(this.whereStatement({ shelf_id: id })).returning("*");
            return shelf;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = ShelfModel;
