const ProductModel = require("../../models/productModel");
const JoiValidatorError = require("../../errorhandlers/JoiValidationError");
const CategoryModel = require("../../models/CategoryModel");
const ItemModel = require("../../models/ItemModel");

const { generateAndUploadBarcode } = require("../../services/barcodeServices");
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
  // static async getAllProductsPaginated(page, limit) {
  //   try {
  //     const result = await productModel.findAllPaginated(page, limit);

  //     // Fetch aggregated stock details for these products
  //     const products = result.data;
  //     const productIds = products.map(p => p.product_id);

  //     const itemModel = new ItemModel();
  //     const stockRows = await itemModel.findByProductIds(productIds);

  //     // Group items by product_id
  //     const stockMap = {};
  //     for (const row of stockRows) {
  //       if (!stockMap[row.product_id]) {
  //         stockMap[row.product_id] = [];
  //       }
  //       stockMap[row.product_id].push(row);
  //     }

  //     // Merge details
  //     const productsWithStock = products.map(product => ({
  //       ...product,
  //       stock_details: stockMap[product.product_id] || []
  //     }));

  //     const totalPages = Math.ceil(result.total / limit);
  //     const offset = (page - 1) * limit;

  //     return {
  //       products: productsWithStock,
  //       total: result.total,
  //       page,
  //       limit,
  //       offset,
  //       totalPages,
  //       previous: page > 1 ? page - 1 : null,
  //       next: page < totalPages ? page + 1 : null
  //     };
  //   } catch (err) {
  //     throw new Error(`Failed to fetch products: ${err.message}`);
  //   }
  // }


  static async getProductFullDetails(id) {
    const { error, value } = productIdSchema.validate(
      { id },
      { abortEarly: false }
    );
    if (error) throw new JoiValidatorError(error);
    try {
      const product = await productModel.findById(value.id);
      if (!product) return null;

      const itemModel = new ItemModel();
      // Fetch all items using the NEW method
      const items = await itemModel.getAllItemsByProductId(value.id);

      // Aggregate items by location (Warehouse -> Room -> Shelf) and status
      const stockMap = new Map();

      items.forEach(item => {
        // Handle unassigned/missing location data gracefully
        const shelfName = item.shelf_name || "Unassigned";
        const roomName = item.room_name || "-";
        const warehouseName = item.warehouse_name || "-";
        const status = item.status || "available";

        const key = `${warehouseName}|${roomName}|${shelfName}|${status}`;

        if (!stockMap.has(key)) {
          stockMap.set(key, {
            product_id: item.product_id,
            warehouse_name: warehouseName,
            room_name: roomName,
            shelf_name: shelfName,
            status: status,
            item_count: 0
          });
        }
        stockMap.get(key).item_count++;
      });

      const stockBreakdown = Array.from(stockMap.values());
      const totalQuantity = items.length;

      return {
        ...product,
        stock_quantity: totalQuantity, // Return actual count of items
        stock_details: stockBreakdown
      };
    } catch (err) {
      throw new Error(`Failed to get product full details: ${err.message}`);
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

      // // Fetch aggregated stock details
      // const ItemModel = require("../../models/ItemModel");
      // const itemModel = new ItemModel();
      // const stockDetails = await itemModel.findByProductId(value.id);

      return {
        ...product,
        // stock_details: stockDetails || [] // Pass raw data to frontend
      };

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


      const barcodeResult = await generateAndUploadBarcode(value.sku);
      value.barcode_image = JSON.stringify(barcodeResult.cdnUrl);

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
      throw new DatabaseError(`Failed to find product by barcode: ${err.message}`);
    }
  }

  static async getProductsByCategoryWithStock(categoryName, page = 1, limit = 10) {
    try {
      const category = await CategoryModel.findByName(categoryName);
      if (!category) {
        throw new JoiValidatorError({
          details: [{ path: ["category"], message: "Invalid category" }]
        });
      }

      const result = await productModel.findByCategoryIdWithStockPaginated(
        category.category_id,
        page,
        limit
      );

      const products = result.data;
      if (products.length > 0) {
        const productIds = products.map(p => p.product_id);

        // 2. Fetch items for these products to get location details
        const itemModel = new ItemModel();
        const items = await itemModel.findByProductIds(productIds);

        // 3. Aggregate locations map
        const productLocationMap = {}; // { productId: "Warehouse A (5), Room B (2)" }

        // Re-using logic from getProductFullDetails but enabling it for the map
        const productStockDetails = {}; // { productId: [ { warehouse_name... } ] }

        items.forEach(item => {
          if (!productStockDetails[item.product_id]) {
            productStockDetails[item.product_id] = {};
          }
          // Key for uniqueness
          const shelfName = item.shelf_name || "Unassigned";
          const roomName = item.room_name || "-";
          const warehouseName = item.warehouse_name || "-";
          const status = item.status || "available";

          const key = `${warehouseName}|${roomName}|${shelfName}|${status}`;

          if (!productStockDetails[item.product_id][key]) {
            productStockDetails[item.product_id][key] = {
              warehouse_name: warehouseName,
              room_name: roomName,
              shelf_name: shelfName,
              status: status,
              item_count: 0
            };
          }
          productStockDetails[item.product_id][key].item_count++;
        });

        // 4. Attach detail array to products
        products.forEach(p => {
          const detailMap = productStockDetails[p.product_id];
          if (detailMap) {
            p.stock_details = Object.values(detailMap);
          } else {
            p.stock_details = [];
          }
        });
      }

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
      throw new Error(`Failed to fetch category products with stock: ${err.message}`);
    }
  }
}

module.exports = ProductManager;
