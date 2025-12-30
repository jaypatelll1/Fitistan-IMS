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

  async findAllPaginated(filters = {}, page = 1, limit = 10) {
    try {
      const qb = await this.getQueryBuilder();
      const offset = (page - 1) * limit;

      const selectColumns = [
        // Item columns
        "items.id as item_id",
        "items.product_id",
        "items.shelf_id",
        "items.status",
        "items.is_deleted",
        "items.created_at",
        "items.updated_at",

        // Product columns
        "products.name as product_name",
        "products.description as product_description",
        "products.sku as product_sku",
        "products.barcode as product_barcode",
        "products.vendor_id as product_vendor_id",

        // Shelf columns
        "shelf.shelf_name",
        "shelf.capacity as shelf_capacity",

        // Room columns
        "rooms.room_name",

        // Warehouse columns
        "warehouses.name as warehouse_name",
      ];

      let query = qb("items")
        .select(selectColumns)
        .leftJoin("products", "items.product_id", "products.product_id")
        .leftJoin("shelf", "items.shelf_id", "shelf.shelf_id")
        .leftJoin("rooms", "shelf.room_id", "rooms.room_id")
        .leftJoin("warehouses", "shelf.warehouse_id", "warehouses.warehouse_id")
        .where("items.is_deleted", false);

      // 🔍 Filters
      if (filters.product_id) {
        query = query.where("items.product_id", filters.product_id);
      }
      if (filters.shelf_id) {
        query = query.where("items.shelf_id", filters.shelf_id);
      }
      if (filters.status) {
        query = query.where("items.status", filters.status);
      }

      const data = await query
        .orderBy("items.created_at", "desc")
        .limit(limit)
        .offset(offset);

      // 🔢 Count query
      let countQuery = qb("items").where("items.is_deleted", false);

      if (filters.product_id) {
        countQuery = countQuery.where("items.product_id", filters.product_id);
      }
      if (filters.shelf_id) {
        countQuery = countQuery.where("items.shelf_id", filters.shelf_id);
      }
      if (filters.status) {
        countQuery = countQuery.where("items.status", filters.status);
      }

      const [{ count }] = await countQuery.count("* as count");

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

      const selectColumns = [
        // Item columns
        "items.id as item_id", ,
        "items.product_id",
        "items.shelf_id",
        "items.status",
        "items.is_deleted",
        "items.created_at",
        "items.updated_at",

        // Product columns
        "products.name as product_name",
        "products.description as product_description",
        "products.sku as product_sku",
        "products.barcode as product_barcode",
        "products.vendor_id as product_vendor_id",

        // Shelf columns
        "shelf.shelf_name",
        "shelf.capacity as shelf_capacity",

        // Room columns
        "rooms.room_name",

        // Warehouse columns
        "warehouses.name as warehouse_name",
      ];

      const items = await qb("items")
        .select(selectColumns)
        .leftJoin("products", "items.product_id", "products.product_id")
        .leftJoin("shelf", "items.shelf_id", "shelf.shelf_id")
        .leftJoin("rooms", "shelf.room_id", "rooms.room_id")
        .leftJoin("warehouses", "shelf.warehouse_id", "warehouses.warehouse_id")
        .where("items.product_id", product_id)
        .where("items.is_deleted", false);

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

  async updateItemStatus({ item_id, product_id, quantity = 1, status }) {
    try {
      if (!Object.values(ITEM_STATUS).includes(status)) {
        throw new Error("Invalid item status");
      }

      const qb = await this.getQueryBuilder();

      // Decide is_deleted based on status
      let isDeleted = false;

      if ([ITEM_STATUS.SOLD, ITEM_STATUS.DAMAGED].includes(status)) {
        isDeleted = true;
      }

      if (status === ITEM_STATUS.RETURN) {
        isDeleted = false;
      }

      // 🔹 Case 1: Update single item (by item_id)
      if (item_id) {
        const [updatedItem] = await qb("items")
          .where({ id: item_id })
          .update({
            status,
            is_deleted: isDeleted,
            updated_at: qb.raw("CURRENT_TIMESTAMP"),
          })
          .returning("*");

        return updatedItem || null;
      }

      // 🔹 Case 2: Update multiple items (by product_id + quantity)
      if (product_id) {
        return await qb("items")
          .whereIn("id", function () {
            this.select("id")
              .from("items")
              .where({ product_id, is_deleted: false })
              .limit(quantity);
          })
          .update({
            status,
            is_deleted: isDeleted,
            updated_at: qb.raw("CURRENT_TIMESTAMP"),
          });
      }

      throw new Error("Either item_id or product_id is required");
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async softDelete(product_id, quantity, status) {
    try {
      const qb = await this.getQueryBuilder();

      // If returned, item should NOT be deleted (it's back in stock)
      const isDeleted = status !== ITEM_STATUS.RETURNED;

      return qb("items")
        .whereIn("id", function () {
          this.select("id")
            .from("items")
            .where({ product_id, is_deleted: !isDeleted }) // Find deleted items if returning, non-deleted otherwise
            .limit(quantity);
        })
        .update({
          is_deleted: isDeleted,
          status: status,
          updated_at: qb.raw("CURRENT_TIMESTAMP")
        });
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // async updateStatus(item_id, status) {
  //     try {
  //         if (!Object.values(ITEM_STATUS).includes(status)) {
  //             throw new Error("Invalid item status");
  //         }

  //         const qb = await this.getQueryBuilder();

  //         let isDeleted = false;

  //         if (status === ITEM_STATUS.SOLD || status === ITEM_STATUS.DAMAGED) {
  //             isDeleted = true;
  //         }

  //         if (status === ITEM_STATUS.RETURN) {
  //             isDeleted = false;
  //         }

  //         const [updatedItem] = await qb("items")
  //             .where({ id: item_id })
  //             .update({
  //                 status,
  //                 is_deleted: isDeleted,
  //                 updated_at: qb.raw("CURRENT_TIMESTAMP"),
  //             })
  //             .returning("*");

  //         return updatedItem || null;
  //     } catch (e) {
  //         throw new DatabaseError(e);
  //     }
  // }

   // async softDelete(product_id, quantity) {
  //     try {
  //         const qb = await this.getQueryBuilder();

  //         return qb("items")
  //             .whereIn("id", function () {
  //                 this.select("id")
  //                     .from("items")
  //                     .where({ product_id, is_deleted: false })
  //                     .limit(quantity);
  //             })
  //             .update({ is_deleted: true });
  //     } catch (e) {
  //         throw new DatabaseError(e);
  //     }
  // }
}

module.exports = ItemModel;
