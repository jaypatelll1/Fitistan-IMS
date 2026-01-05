const ItemModel = require("../../models/ItemModel");
const ProductModel = require("../../models/productModel");
const OrderManager = require("./OrderManager");
const JoiValidatorError = require("../../errorhandlers/JoiValidationError");
const { ITEM_STATUS, ORDER_STATUS, ORDER_MODE } = require("../../models/libs/dbConstants");
const OrderModel = require("../../models/OrderModel");

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

  static async removeItemStock(
    product_id,
    quantity,
    status = ITEM_STATUS.SOLD,
    order_id = null,
    shelf_id = null, // 🆕 you need to know which shelf the product is coming from
    mode = ORDER_MODE.ONLINE // 🆕 Added mode (Online/Offline)
  ) {
    try {
      const itemModel = new ItemModel();
      const orderModel = new OrderModel();

      product_id = Number(product_id);
      quantity = Number(quantity);

      const normalizedStatus = String(status).trim().toLowerCase();

      if (!Object.values(ITEM_STATUS).includes(normalizedStatus)) {
        throw new Error(`Invalid item status: ${normalizedStatus}`);
      }

      const isReturn = normalizedStatus === ITEM_STATUS.RETURNED;

      if (!isReturn && quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      // Check stock only for sell/outward
      if (!isReturn) {
        const available = await itemModel.countByProductId(product_id);
        if (available < quantity) {
          throw new Error("Insufficient stock");
        }
      }

      // Remove/return stock
      const affected = await itemModel.softDelete(
        product_id,
        quantity,
        normalizedStatus,
        shelf_id // ✅ Pass shelf_id to delete specific items
      );

      if (isReturn && affected === 0) {
        throw new Error("No sold items found to return");
      }

      // ✅ Create order if selling and no existing order_id provided
      let createdOrderId = order_id;
      if (!isReturn && affected > 0) {
        if (!shelf_id) {
          throw new Error("Shelf ID is required to create an order");
        }

        const orderData = {
          product_id,
          shelf_id,
          quantity,
          status: ORDER_STATUS.SOLD,
          mode // ✅ Save mode (Online/Offline)
        };

        const createdOrder = await orderModel.create(orderData);
        createdOrderId = createdOrder.order_id;
      }

      return {
        product_id,
        quantity,
        status: normalizedStatus,
        affected,
        order_id: createdOrderId,
      };
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
  static async returnStock({ product_id, quantity, shelf_id }) {
    try {
      const itemModel = new ItemModel();
      const productModel = new ProductModel();

      if (!product_id || !quantity || !shelf_id) {
        throw new Error("product_id, quantity, and shelf_id are required");
      }

      // Verify product exists
      const product = await productModel.findById(product_id);
      if (!product) {
        throw new Error("Product not found");
      }

      // Perform the return
      const affected = await itemModel.returnItems(product_id, quantity, shelf_id);

      if (affected === 0) {
        throw new Error("No sold items found to return (or insufficient quantity sold)");
      }

      if (affected < quantity) {
        // This is a partial success case, theoretically. 
        // But for now we just return what we did.
        console.warn(`Requested return of ${quantity} but only ${affected} items were found/returned.`);
      }

      // Create order record for the return
      await OrderManager.createOrder(product_id, shelf_id, affected, ORDER_STATUS.RETURNED);

      return {
        success: true,
        affected,
        message: `Successfully returned ${affected} item(s)`
      };

    } catch (error) {
      throw new Error(`Failed to return stock: ${error.message}`);
    }
  }
}

module.exports = itemManager;
