const BaseModel = require("../models/libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const {TABLE_DEFAULTS} = require("../models/libs/dbConstants");

class ProductModel extends BaseModel {
    constructor(userId) {
        super(userId);
        this.tableName = "products";
    }

    async findAll() {
        try {
            const qb = await this.getQueryBuilder();
            return qb.select('*')
                .table(this.tableName)
                .where(this.whereStatement())
                .orderBy('product_id', 'asc');
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async findById(product_id) {
        try {
            const qb = await this.getQueryBuilder();
            return qb.select('*')
                .table(this.tableName)
                .where(this.whereStatement({ product_id }))
                .first();
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async create(productData) {
        try {
            const qb = await this.getQueryBuilder();
            const data = this.buildCreateData(productData);

            const [product] = await qb.table(this.tableName).insert(data).returning('*');
            return product;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

   async update(product_id, productData) {
    try {
        const qb = await this.getQueryBuilder();

        const data = await this.buildUpdateData(productData);

        const [updatedProduct] = await qb
            .table(this.tableName)
            .where({ product_id })
            .update(data)
            .returning("*");

        return updatedProduct;
    } catch (e) {
        throw new DatabaseError(e);
    }
}


    async delete(product_id) {
        try {
            const qb = await this.getQueryBuilder();
            return await qb.table(this.tableName)
                .where({ product_id })
                .update({ [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: true });
        } catch (e) {


            console.error("DELETE PRODUCT ERROR:", e.message);
            console.error("DETAIL:", e.detail);
            throw new DatabaseError(e);


        }
    }
}

module.exports = ProductModel;