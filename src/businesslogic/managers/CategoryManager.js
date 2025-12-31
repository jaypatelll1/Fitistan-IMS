const JoiValidatorError = require("../../errorhandlers/JoiValidationError");
const CategoryModel = require("../../models/CategoryModel");
const ProductModel = require("../../models/ProductModel");
const validationError= require("../../errorhandlers/ValidationError")


class CategoryManager {


   static async getProductsByCategoryPaginated(categoryName, userId, page, limit) {
    try {
      // 1️⃣ Validate category
      const category = await CategoryModel.findByName(categoryName);
      if (!category) {
        throw new ValidationError("Invalid category");
      }

      // 2️⃣ Product model instance
      const productModel = new ProductModel(userId);

      // 3️⃣ Fetch paginated data (same as reference)
      const result = await productModel.findByCategoryIdPaginated(
        category.category_id,
        page,
        limit
      );

      console.log("Paginated products for category:", categoryName, result);
      const totalPages = Math.ceil(result.total / limit);
      const offset = (page - 1) * limit;

      return {
        products: result.items,
        total: result.total,
        page,
        limit,
        offset,
        totalPages,
        previous: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null
      };
    } catch (err) {
      throw new Error(`Failed to fetch category products: ${err.message}`);
    }
  }
}




module.exports = CategoryManager;