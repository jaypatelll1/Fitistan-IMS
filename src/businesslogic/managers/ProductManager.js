const ProductModel = require("../../models/ProductModel");
const JoiValidatorError = require("../../errorhandlers/JoiValidationError");
const CategoryModel = require("../../models/CategoryModel");

const {
  productIdSchema,
  createProductSchema,
  updateProductSchema
} = require("../../validators/productValidator");



const productModel = new ProductModel(); // no userId for now
class ProductManager {

  static async getAllProductsPaginated(page, limit) {
    try {
      const result = await productModel.findAllPaginated(page, limit);
 
            

      const totalPages = Math.ceil(result.total / limit);
      const offset = (page - 1) * limit;

      return {

        products: result.data,

        total: result.total,
        page,
        limit,
        offset,
        totalPages,
        previous: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null
      };
    } catch (err) {
      throw new Error(`Failed to fetch products: ${err.message}`);
    }
  }

  static async getProductById(id) {
    const { error, value } = productIdSchema.validate(
      { id },
      { abortEarly: false }
    );
    if (error) throw new JoiValidatorError(error);

    try {
      const product = await productModel.findById(value.id);
      if (!product) return null;
      return product;
    } catch (err) {
      throw new Error(`Failed to get product by ID: ${err.message}`);
    }
  }

  static async createProduct(productData) {
    const { error, value } = createProductSchema.validate(productData, {
      abortEarly: false,
      stripUnknown: true
    });
    if (error) throw new JoiValidatorError(error);

    try {
      const verifyProduct = await productModel.findBySkuId(value.sku);
      if (verifyProduct) {
        throw new JoiValidatorError({
          details: [
            { path: ["sku"], message: "Product with this SKU already exists" }
          ]
        });
      }

          const category = await CategoryModel.findByName(value.category);
    if (!category) {
      throw new JoiValidatorError({
        details: [
          { path: ["category"], message: "Invalid category selected" }
        ]
      });
    }

    // 3️⃣ Mutate value safely
    value.category_id = category.category_id;
    delete value.category;

      value.barcode = value.sku;
      const product = await productModel.create(value);
      return product;

    } catch (err) {
      throw err;
    }
  }

  static async updateProduct(id, data) {
    const idCheck = productIdSchema.validate({ id }, { abortEarly: false });
    if (idCheck.error) throw new JoiValidatorError(idCheck.error);

    const { error, value } = updateProductSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });
    if (error) throw new JoiValidatorError(error);

    try {
      const verifyProduct = await productModel.findById(id);
      if (!verifyProduct) {
        return null;
      }

      const product = await productModel.update(id, value);
      return product || null;

    } catch (err) {
      throw new Error(`Failed to update product: ${err.message}`);
    }
  }

  static async deleteProduct(id) {
    const { error, value } = productIdSchema.validate(
      { id },
      { abortEarly: false }
    );
    if (error) throw new JoiValidatorError(error);

    try {
      const product = await productModel.softDelete(value.id);
      return product || null;
    } catch (err) {
      throw new Error(`Failed to delete product: ${err.message}`);
    }
  }

  static async findBysku(sku) {
    if (!sku) {
      throw new JoiValidatorError({
        details: [{ path: ["sku"], message: "SKU is required" }]
      });
    }

    try {
      return await productModel.findBySkuId(sku);
    } catch (err) {
      throw new Error(`Failed to find product by SKU: ${err.message}`);
    }
  }

  static async generateBarcode(barcode) {
    if (!barcode) {
      throw new JoiValidatorError({
        details: [{ path: ["barcode"], message: "Barcode is required" }]
      });
    }

    try {
      return await productModel.generateBarcode(barcode);
    } catch (err) {
      throw new Error(`Failed to find product by barcode: ${err.message}`);
    }
  }
}

module.exports = ProductManager;
