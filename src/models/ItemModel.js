const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const { ITEM_STATUS } = require("./libs/dbConstants");

class ItemModel extends BaseModel {
  constructor(userId) {
    super(userId);
    this.tableName = "items";
  }

  // ✅ FIXED: removed invalid "name" column
  getPublicColumns() {
    return ["id", "shelf_id", "product_id", "status", "is_deleted"];
  }

  async findAllPaginated(filters = {}, page = 1, limit = 10) {
    try {
      const qb = await this.getQueryBuilder();
      const offset = (page - 1) * limit;

      const selectColumns = [
        "items.id as item_id",
        "items.product_id",
        "items.shelf_id",
        "items.status",
        "items.is_deleted",
        "items.created_at",
        "items.updated_at",

        "products.name as product_name",
        "products.description as product_description",
        "products.sku as product_sku",
        "products.barcode as product_barcode",
        "products.vendor_id as product_vendor_id",

        "shelf.shelf_name",
        "shelf.capacity as shelf_capacity",

        "rooms.room_name",
        "warehouses.name as warehouse_name",
      ];

      let query = qb("items")
        .select(selectColumns)
        .leftJoin("products", "items.product_id", "products.product_id")
        .leftJoin("shelf", "items.shelf_id", "shelf.shelf_id")
        .leftJoin("rooms", "shelf.room_id", "rooms.room_id")
        .leftJoin("warehouses", "shelf.warehouse_id", "warehouses.warehouse_id")
        .where("items.is_deleted", false);

      if (filters.product_id) {
        query.where("items.product_id", filters.product_id);
      }
      if (filters.shelf_id) {
        query.where("items.shelf_id", filters.shelf_id);
      }
      if (filters.status) {
        query.where("items.status", filters.status);
      }

      const data = await query
        .orderBy("items.created_at", "desc")
        .limit(limit)
        .offset(offset);

      const [{ count }] = await qb("items")
        .where("items.is_deleted", false)
        .modify(qb => {
          if (filters.product_id) qb.where("product_id", filters.product_id);
          if (filters.shelf_id) qb.where("shelf_id", filters.shelf_id);
          if (filters.status) qb.where("status", filters.status);
        })
        .count("* as count");

      return { data, total: Number(count) };
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async create(data, product_id) {
    try {
      const qb = await this.getQueryBuilder();
      const insertData = this.insertStatement({
        ...data,
        product_id,
        status: ITEM_STATUS.AVAILABLE,
      });

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

      return await qb("items")
        .leftJoin("products", "items.product_id", "products.product_id")
        .leftJoin("shelf", "items.shelf_id", "shelf.shelf_id")
        .leftJoin("rooms", "shelf.room_id", "rooms.room_id")
        .leftJoin("warehouses", "shelf.warehouse_id", "warehouses.warehouse_id")
        .where("items.product_id", product_id)
        .where("items.is_deleted", false);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // ✅ FIXED: count only AVAILABLE items
  async countByProductId(product_id) {
    try {
      const qb = await this.getQueryBuilder();

      const [{ count }] = await qb("items")
        .where({
          product_id,
          is_deleted: false,
          status: ITEM_STATUS.AVAILABLE,
        })
        .count("* as count");

      return Number(count);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async updateItemStatus({ item_id, product_id, quantity = 1, status }) {
    try {
      const normalizedStatus = String(status).toLowerCase();

      if (!Object.values(ITEM_STATUS).includes(normalizedStatus)) {
        throw new Error("Invalid item status");
      }

      const qb = await this.getQueryBuilder();
      const isDeleted =
        normalizedStatus !== ITEM_STATUS.RETURNED &&
        normalizedStatus !== ITEM_STATUS.AVAILABLE;

      if (item_id) {
        const [updated] = await qb("items")
          .where({ id: item_id })
          .update({
            status: normalizedStatus,
            is_deleted: isDeleted,
            updated_at: qb.raw("CURRENT_TIMESTAMP"),
          })
          .returning("*");

        return updated;
      }

      if (product_id) {
        return qb("items")
          .whereIn("id", function () {
            this.select("id")
              .from("items")
              .where({ product_id, is_deleted: false })
              .limit(quantity);
          })
          .update({
            status: normalizedStatus,
            is_deleted: isDeleted,
            updated_at: qb.raw("CURRENT_TIMESTAMP"),
          });
      }

      throw new Error("Either item_id or product_id is required");
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // ✅ FIXED QUERY
  async countAvailableItemsByProduct() {
    try {
      const qb = await this.getQueryBuilder();

      return await qb("items")
        .select("product_id")
        .count("* as available_count")
        .where({
          status: ITEM_STATUS.AVAILABLE,
          is_deleted: false,
        })
        .groupBy("product_id");
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async softDelete(product_id, quantity, status) {
    try {
      const qb = await this.getQueryBuilder();
      const isDeleted = status !== ITEM_STATUS.RETURNED;

      return qb("items")
        .whereIn("id", function () {
          this.select("id")
            .from("items")
            .where({
              product_id,
              is_deleted: !isDeleted,
            })
            .limit(quantity);
        })
        .update({
          is_deleted: isDeleted,
          status,
          updated_at: qb.raw("CURRENT_TIMESTAMP"),
        });
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
  // New method for full product details
  async getAllItemsByProductId(product_id) {
    try {
      const qb = await this.getQueryBuilder();

      const selectColumns = [
        "items.id as item_id",
        "items.product_id",
        "items.status",
        "items.shelf_id",
        "items.created_at",

        // Location info
        "shelf.shelf_name",
        "shelf.room_id",
        "shelf.warehouse_id",
        "rooms.room_name",
        "warehouses.name as warehouse_name",

        // Product info (redundant but useful for join validation)
        "products.name as product_name",
        "products.sku as product_sku"
      ];

      return await qb("items")
        .select(selectColumns)
        .leftJoin("products", "items.product_id", "products.product_id")
        .leftJoin("shelf", "items.shelf_id", "shelf.shelf_id")
        .leftJoin("rooms", "shelf.room_id", "rooms.room_id")
        .leftJoin("warehouses", "shelf.warehouse_id", "warehouses.warehouse_id")
        .where("items.product_id", product_id)
        .where("items.is_deleted", false);

    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async findByProductIds(productIds) {
    try {
      const qb = await this.getQueryBuilder();

      const selectColumns = [
        "items.id as item_id",
        "items.product_id",
        "items.status",
        "items.shelf_id", // Keep for reference
        // Location info
        "shelf.shelf_name",
        "rooms.room_name",
        "warehouses.name as warehouse_name",
      ];

      return await qb("items")
        .select(selectColumns)
        .leftJoin("shelf", "items.shelf_id", "shelf.shelf_id")
        .leftJoin("rooms", "shelf.room_id", "rooms.room_id")
        .leftJoin("warehouses", "shelf.warehouse_id", "warehouses.warehouse_id")
        .whereIn("items.product_id", productIds)
        .where("items.is_deleted", false);

    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

module.exports = ItemModel;
