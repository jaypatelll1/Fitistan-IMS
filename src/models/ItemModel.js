const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const { ITEM_STATUS } = require("./libs/dbConstants");

class ItemModel extends BaseModel {
    constructor(userId) {
        super(userId);
    }

    // ✅ PUBLIC COLUMNS
    getPublicColumns() {
        return ["id", "name", "shelf_id", "product_id", "status", "is_deleted"];
    }

    async findAllPaginated(product_id, page = 1, limit = 10) {
        try {
            const qb = await this.getQueryBuilder();
            const offset = (page - 1) * limit;

            const data = await qb("items")
                .select(this.getPublicColumns())
                .where(this.whereStatement({ product_id }))
                .limit(limit)
                .offset(offset);

            const [{ count }] = await qb("items")
                .where(this.whereStatement({ product_id }))
                .count("* as count");

            return {
                data,
                total: Number(count),
            };
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async create(data, product_id) {
        try {
            const qb = await this.getQueryBuilder();
            const insertData = this.insertStatement({ ...data, product_id });

            const [item] = await qb("items")
                .insert(insertData)
                .returning(this.getPublicColumns());

            return item;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async findByProductId(product_id) {
        try {
            const qb = await this.getQueryBuilder();
            const items = await qb("items")
                .select(this.getPublicColumns())
                .where(this.whereStatement({ product_id }));

            return items.length ? items : null;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async countByProductId(product_id) {
        try {
            const qb = await this.getQueryBuilder();

            const result = await qb("items")
                .where(this.whereStatement({ product_id }))
                .count("* as count")
                .first();

            return Number(result.count);
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async softDelete(product_id, quantity) {
        try {
            const qb = await this.getQueryBuilder();

            return qb("items")
                .whereIn("id", function () {
                    this.select("id")
                        .from("items")
                        .where({ product_id, is_deleted: false })
                        .limit(quantity);
                })
                .update({ is_deleted: true });
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async updateStatus(item_id, status) {
        try {
            if (!Object.values(ITEM_STATUS).includes(status)) {
                throw new Error("Invalid item status");
            }

            const qb = await this.getQueryBuilder();

            let isDeleted = false;

            if (status === ITEM_STATUS.SOLD || status === ITEM_STATUS.DAMAGED) {
                isDeleted = true;
            }

            if (status === ITEM_STATUS.RETURN) {
                isDeleted = false;
            }

            const [updatedItem] = await qb("items")
                .where({ id: item_id })
                .update({
                    status,
                    is_deleted: isDeleted,
                    updated_at: qb.raw("CURRENT_TIMESTAMP"),
                })
                .returning("*");

            return updatedItem || null;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }
}

module.exports = ItemModel;
