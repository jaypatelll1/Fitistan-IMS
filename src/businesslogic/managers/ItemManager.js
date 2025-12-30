const ItemModel = require("../../models/ItemModel");
const ProductModel = require("../../models/ProductModel");
const OrderManager = require("./OrderManager");
const JoiValidatorError = require("../../errorhandlers/JoiValidationError");
const { ITEM_STATUS } = require("../../models/libs/dbConstants");

const {
  createItemSchema,
  removeStockSchema,
  paginationSchema,
} = require("../../validators/itemValidator");

class itemManager {
  static async createItem(product_id, shelf_id, quantity) {
    try {
      const itemModel = new ItemModel();
      const productModel = new ProductModel();

      console.log("payload", { product_id, shelf_id, quantity });

      // 1. Verify product using SKU (barcode == sku)
      const Product = await productModel.findById(product_id);
      console.log("Product", Product);

      if (!Product) {
        return null; // product not found
      }

      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      // 2. Insert items (1 row = 1 physical item)
      const createdItems = [];

      for (let i = 0; i < quantity; i++) {
        const item = await itemModel.create(
          {
            name: Product.name,
            shelf_id: shelf_id,
          },
          product_id
        );

        createdItems.push(item);
      }

      return createdItems; // return all created rows
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async removeItemStock(product_id, shelf_id, quantity, status, order_id = null) {
    try {
      const itemModel = new ItemModel();
      const normalizedStatus = String(status).trim().toLowerCase();

      // For returns, we restore items (is_deleted: false)
      // For other statuses, we remove items (is_deleted: true)
      const isReturn = normalizedStatus === ITEM_STATUS.RETURNED;

      if (!isReturn && quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      if (!isReturn) {
        const items = await itemModel.countByProductId(product_id);
        console.log("items", items);

        if (items < quantity) {
          throw new Error("Insufficient stock");
        }
      }

      // 1. Soft delete/restore the items and update their status
      const deleted = await itemModel.softDelete(product_id, quantity, normalizedStatus);

      // For returns: check if any sold items were found to restore
      if (isReturn && deleted === 0) {
        throw new Error("No sold items found to return for this product");
      }

      let order;
      if (isReturn && order_id) {
        // 2a. For returns: UPDATE existing order status
        order = await OrderManager.updateOrderStatus(order_id, normalizedStatus);
        console.log("Order updated:", order);
      } else {
        // 2b. For new orders: CREATE new order record
        order = await OrderManager.createOrder(
          product_id,
          shelf_id,
          quantity,
          normalizedStatus
        );
        console.log("Order created:", order);
      }

      return { removed: quantity, deleted, order };
    } catch (error) {
      throw new Error(`Failed to remove stock: ${error.message}`);
    }
  }

  static async updateItemStatus(payload) {

    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload");
    }

    if (!payload.status) {
      throw new Error("Status is required");
    }

    // Normalize ONLY for comparison
    const incomingStatus = String(payload.status).trim().toLowerCase();

    const allowedStatuses = Object.values(ITEM_STATUS);

    if (!allowedStatuses.includes(incomingStatus)) {
      throw new Error(`Invalid item status: ${payload.status}`);
    }

    // ✅ Store enum value (not user input)
    payload.status = incomingStatus;

    const itemModel = new ItemModel();
    return await itemModel.updateItemStatus(payload);
  }



  static async getItemCount(product_id) {
    try {
      const itemModel = new ItemModel();
      const count = await itemModel.countByProductId(product_id);
      return count;
    } catch (error) {
      throw new Error(`Failed to get item count: ${error.message}`);
    }
  }

  static async getItemsPaginated(product_id, page, limit) {
    try {
      const itemModel = new ItemModel();
      const result = await itemModel.findAllPaginated(product_id, page, limit);
      const offset = (page - 1) * limit;
      const totalPages = Math.ceil(result.total / limit);

      return {
        items: result.data,
        page,
        limit,
        offset,
        total: result.total,
        totalPages,
        previous: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null,
      };
    } catch (error) {
      throw new Error(`Failed to get items: ${error.message}`);
    }
  }
}

module.exports = itemManager;
