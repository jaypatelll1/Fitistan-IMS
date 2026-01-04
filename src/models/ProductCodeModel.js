const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const { TABLE_DEFAULTS } = require("./libs/dbConstants");

class ProductCodeModel extends BaseModel {
    constructor(userId) {
        super(userId);
        this.tableName = "product_codes";
        this.tableId = "id"; // Overriding since BaseModel usually assumes something else or I need to check BaseModel
    }

    /**
     * Search for product codes by prefix (for autocomplete)
     */
    async searchCodes(query) {
        try {
            const qb = await this.getQueryBuilder();
            return await qb(this.tableName)
                .where("code", "ilike", `%${query}%`)
                .orWhere("name", "ilike", `%${query}%`)
                .where("is_deleted", false)
                .limit(10);
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async findByCode(code) {
        try {
            const qb = await this.getQueryBuilder();
            return await qb(this.tableName)
                .where({ code, is_deleted: false })
                .first();
        } catch (e) {
            throw new DatabaseError(e);
        }
    }
    async create(data) {
        try {
            const qb = await this.getQueryBuilder();
            const insertData = this.insertStatement(data); // Uses BaseModel helper
            const [record] = await qb(this.tableName)
                .insert(insertData)
                .returning("*");
            return record;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }
}

module.exports = ProductCodeModel;
