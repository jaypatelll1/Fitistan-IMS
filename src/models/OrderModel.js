const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class OrderModel extends BaseModel {
    constructor(userId) {
        super(userId);
    }

    // ✅ PUBLIC COLUMNS
    getPublicColumns() {
        return ["order_id", "product_id", "shelf_id", "quantity", "status", "created_at", "updated_at"];
    }

    async findAllPaginated(filters = {}, page = 1, limit = 10) {
        try {
            const qb = await this.getQueryBuilder();
            const offset = (page - 1) * limit;

            let query = qb("orders")
                .select(this.getPublicColumns())
                .where(this.whereStatement({}));

            // Apply filters
            if (filters.product_id) {
                query = query.where("product_id", filters.product_id);
            }
            if (filters.shelf_id) {
                query = query.where("shelf_id", filters.shelf_id);
            }
            if (filters.status) {
                query = query.where("status", filters.status);
            }

            const data = await query
                .orderBy("created_at", "desc")
                .limit(limit)
                .offset(offset);

            // Count query
            let countQuery = qb("orders")
                .where(this.whereStatement({}));

            if (filters.product_id) {
                countQuery = countQuery.where("product_id", filters.product_id);
            }
            if (filters.shelf_id) {
                countQuery = countQuery.where("shelf_id", filters.shelf_id);
            }
            if (filters.status) {
                countQuery = countQuery.where("status", filters.status);
            }

            const [{ count }] = await countQuery.count("* as count");

            return {
                data,
                total: Number(count)
            };

        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async create(data) {
        try {
            const qb = await this.getQueryBuilder();
            const insertData = this.insertStatement(data);

            const [order] = await qb("orders")
                .insert(insertData)
                .returning(this.getPublicColumns());

            return order;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async findById(order_id) {
        try {
            const qb = await this.getQueryBuilder();
            const order = await qb("orders")
                .select(this.getPublicColumns())
                .where(this.whereStatement({ order_id }))
                .first();

            return order || null;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async updateStatus(order_id, status) {
        try {
            const qb = await this.getQueryBuilder();

            const [updated] = await qb("orders")
                .where(this.whereStatement({ order_id }))
                .update({ status, updated_at: qb.fn.now() })
                .returning(this.getPublicColumns());

            return updated || null;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }
}

module.exports = OrderModel;
