const ItemModel = require("../../models/ItemModel");
const ProductModel = require("../../models/ProductModel");
const JoiValidatorError = require("../../errorhandlers/JoiValidationError");

const {
  createItemSchema,
  removeStockSchema,
  paginationSchema
} = require("../../validators/itemValidator");

class itemManager {

  static async createItem(product_id, shelf_id, quantity) {
    const { error, value } = createItemSchema.validate(
      { product_id, shelf_id, quantity },
      { abortEarly: false, stripUnknown: true }
    );

    if (error) throw new JoiValidatorError(error);

    try {
      const itemModel = new ItemModel();
      const productModel = new ProductModel();

      const Product = await productModel.findById(value.product_id);
      if (!Product) return null;

      const createdItems = [];

      for (let i = 0; i < value.quantity; i++) {
        const item = await itemModel.create({
          product_id: value.product_id,
          name: Product.name,
          shelf_id: value.shelf_id
        });
        createdItems.push(item);
      }

      return createdItems;

    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async removeItemStock(product_id, quantity) {
    const { error, value } = removeStockSchema.validate(
      { product_id, quantity },
      { abortEarly: false }
    );

    if (error) throw new JoiValidatorError(error);

    try {
      const itemModel = new ItemModel();

      const items = await itemModel.countByProductId(value.product_id);
      if (items < value.quantity) {
        throw new Error("Insufficient stock");
      }

      const deleted = await itemModel.softDelete(
        value.product_id,
        value.quantity
      );

      return {
        removed: value.quantity,
        deleted
      };

    } catch (error) {
      throw new Error(`Failed to remove stock: ${error.message}`);
    }
  }

  static async getItemsPaginated(product_id, page, limit) {
    const { error, value } = paginationSchema.validate(
      { product_id, page, limit },
      { abortEarly: false }
    );

    if (error) throw new JoiValidatorError(error);

    try {
      const itemModel = new ItemModel();

      const result = await itemModel.findAllPaginated(
        value.product_id,
        value.page,
        value.limit
      );

      const totalPages = Math.ceil(result.total / value.limit);
      const offset = (value.page - 1) * value.limit;

      return {
        items: result.data,
        total: result.total,
        page: value.page,
        limit: value.limit,
        totalPages,
        offset,
        previous: value.page > 1 ? value.page - 1 : null,
        next: value.page < totalPages ? value.page + 1 : null
      };

    } catch (error) {
      throw new Error(`Failed to fetch items: ${error.message}`);
    }
  }
}

module.exports = itemManager;
