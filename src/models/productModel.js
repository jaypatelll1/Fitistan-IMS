const BaseModel = require("../models/libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const { TABLE_DEFAULTS } = require("../models/libs/dbConstants");

class ProductModel extends BaseModel {
    constructor(userId) {
        super(userId);
        this.tableName = "products";
    }

    async findAll() {
        try {
            const queryBuilder = await this.getQueryBuilder();
            return queryBuilder.select('*')
                .table(this.tableName)
                .where(this.whereStatement())
                .orderBy('product_id', 'asc');
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async findById(product_id) {
        try {
            const queryBuilder = await this.getQueryBuilder();
            return queryBuilder.select('*')
                .table(this.tableName)
                .where(this.whereStatement({ product_id }))
                .first();
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async create(productData) {
        try {
            const queryBuilder = await this.getQueryBuilder();
            const data = this.insertStatement(productData);
            console.log(" models Inserting product with data:", data);
            const [product] = await queryBuilder.table(this.tableName).insert(data).returning('*');
            if (!product) {

                console.error("Product creation failed, no product returned.");
                return null;
            }
            return product;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async update(product_id, productData) {
        try {
            const queryBuilder = await this.getQueryBuilder();

            const data = await this.updateStatement(productData);
            if (!data) {
                console.error("No valid fields to update for product:", product_id);
            }


            const [updatedProduct] = await queryBuilder
                .table(this.tableName)
                .where(this.whereStatement({ product_id }))
                .update(data)
                .returning("*");

            return updatedProduct;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }


    async softDelete(product_id) {
        try {
            const queryBuilder = await this.getQueryBuilder();
            return await queryBuilder.table(this.tableName)
                .where(this.whereStatement({ product_id }))
                .update({ [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: true });
        } catch (e) {


            console.error("DELETE PRODUCT ERROR:", e.message);
            console.error("DETAIL:", e.detail);
            throw new DatabaseError(e);


        }
    }

    async findBySkuId(sku) {
        try {
            console.log("Finding product by SKU:", sku);
            const queryBuilder = await this.getQueryBuilder();
            const data = await queryBuilder.select('*')
                .table(this.tableName)
                .where(this.whereStatement({ sku }))
                .first();
            return data;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async findByBarcode(barcode) {
        try {
            console.log("Finding product by barcode:", barcode);
            const queryBuilder = await this.getQueryBuilder();
            const data = await queryBuilder.select('*')
                .table(this.tableName)
                .where(this.whereStatement({ barcode }))
                .first();
            return data;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }
}

module.exports = ProductModel;