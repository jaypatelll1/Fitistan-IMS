const BaseModel = require("../models/libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const { TABLE_DEFAULTS } = require("../models/libs/dbConstants");

class ProductModel extends BaseModel {
  constructor(userId) {
    super(userId);
    this.tableName = "products";
  }

  /**
   * ✅ ONLY product table columns here
   */
  getPublicColumns() {
    return [
      "product_id",
      "name",
      "description",
      "vendor_id",
      "sku",
      "barcode",
      "product_image",
      "barcode_image",
      "size",
      "category_id",
    ];
  }

  getPrivateColumns() {
    return [
      "product_id",
      "name",
      "description",
      "vendor_id",
      "sku",
      "barcode",
      "product_image",
      "barcode_image",
      "size",
      "products.category_id",
      "category_name",
    ];
  }

  /**
   * ✅ Get all products with category name
   * Normalize product to ensure consistent JSONB structure
   */
  normalizeProduct(product) {
    return {
      ...product,
      product_image: product.product_image || [],   // always array
      barcode_image: product.barcode_image || null // always object
    };
  }

  /**
   * Get all products with pagination
   */
  async findAllPaginated(page = 1, limit = 10) {
    try {
      const qb = await this.getQueryBuilder();
      const offset = (page - 1) * limit;

      const data = await qb("products")
        .select([
          "products.product_id",
          "products.name",
          "products.description",
          "products.vendor_id",
          "products.sku",
          "products.barcode",
          "products.product_image",
          "products.barcode_image",
          "products.size",
          "products.category_id",
          "category.category_name as category_name",
        ])
        .leftJoin("category", "products.category_id", "category.category_id")
        .where("products.is_deleted", false)
        .orderBy("products.product_id", "asc")
        .limit(limit)
        .offset(offset);

      const [{ count }] = await qb("products")
        .where("products.is_deleted", false)
        .count("* as count");

      return {
        data: data.map(this.normalizeProduct),
        total: Number(count),
      };
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * ✅ Products by category
   */
  async findByCategoryIdPaginated(category_id, page = 1, limit = 10) {
    try {
      const qb = await this.getQueryBuilder();
      const offset = (page - 1) * limit;

      const data = await qb("products")
        .select([
          "products.product_id",
          "products.name",
          "products.description",
          "products.vendor_id",
          "products.sku",
          "products.barcode",
          "products.product_image",
          "products.barcode_image",
          "products.size",
          "products.category_id",
          "category.category_name as category_name",
        ])
        .leftJoin("category", "products.category_id", "category.category_id")
        .where({
          "products.category_id": category_id,
          "products.is_deleted": false,
        })
        .orderBy("products.product_id", "asc")
        .limit(limit)
        .offset(offset);

      const [{ count }] = await qb("products")
        .where({
          category_id,
          is_deleted: false,
        })
        .count("* as count");

      return {
        data,
        total: Number(count),
      };
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async countTotalProducts() {
    try {
      const qb = await this.getQueryBuilder();

      const [{ count }] = await qb("products")
        .where("is_deleted", false)
        .count("* as count");

      return Number(count);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * ✅ Get product by ID (with category name)
   */
  async findById(product_id) {
    try {
      const qb = await this.getQueryBuilder();

      return (
        (await qb("products")
          .select([
            "products.product_id",
            "products.name",
            "products.description",
            "products.vendor_id",
            "products.sku",
            "products.barcode",
            "products.product_image",
            "products.barcode_image",
            "products.size",
            "products.category_id",
            "category.category_name as category_name",
          ])
          .leftJoin("category", "products.category_id", "category.category_id")
          .where({
            "products.product_id": product_id,
            "products.is_deleted": false,
          })
          .first()) || null
      );
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // async countByCategoryId(category_id) {
  //   try {
  //     const qb = await this.getQueryBuilder();

  //     const [{ count }] = await qb("products")
  //       .where({
  //         category_id,
  //         is_deleted: false,
  //       })
  //       .count("* as count");

  // Count total products
  async countTotalProducts() {
    try {
      const qb = await this.getQueryBuilder();
      const [{ count }] = await qb(this.tableName)
        .where(this.whereStatement())
        .count("* as count");

      return Number(count);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // Get product by ID
  async findById(product_id) {
    try {
      const qb = await this.getQueryBuilder();
      const product = await qb(this.tableName)
        .select(this.getPublicColumns())
        .where(this.whereStatement({ product_id }))
        .first();

      return product ? this.normalizeProduct(product) : null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async countByCategoryId(category_id) {
    try {
      const qb = await this.getQueryBuilder();

      const [{ count }] = await qb("products")
        .where({
          category_id,
          is_deleted: false,
        })
        .count("* as count");

  // Count products by category ID
  // async countByCategoryId(category_id) {
  //   try {
  //     const qb = await this.getQueryBuilder();
  //     const [{ count }] = await qb(this.tableName)
  //       .where(this.whereStatement({ category_id }))
  //       .count("* as count");

      return Number(count);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * ✅ Create product
   */
  async create(productData) {
    try {
      const qb = await this.getQueryBuilder();

      // Normalize JSONB fields
      if (!productData.product_image) productData.product_image = [];
      if (!productData.barcode_image) productData.barcode_image = null;

      const data = this.insertStatement(productData);

      const [product] = await qb("products")
        .insert(data)
        .returning(this.getPublicColumns());

      return product ? this.normalizeProduct(product) : null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * ✅ Update product
   */
  async update(product_id, productData) {
    try {
      const qb = await this.getQueryBuilder();
      const data = await this.updateStatement(productData);

      if (!data || Object.keys(data).length === 0) return null;

      // If fields not provided, leave them undefined
      if (data.product_image === undefined) data.product_image = undefined;
      if (data.barcode_image === undefined) data.barcode_image = undefined;

      const updatedRows = await qb("products")
        .where({ product_id })
        .update({
          ...data,
          [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP"),
        });

      if (!updatedRows) {
        return null;
      }

      return this.findById(product_id);
      return updatedProduct ? this.normalizeProduct(updatedProduct) : null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * ✅ Soft delete
   */
  async softDelete(product_id) {
    try {
      const qb = await this.getQueryBuilder();

      return qb("products")
        .where({ product_id })
        .update({
          is_deleted: true,
          [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP"),
        });
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async findBySkuId(sku) {
    try {
      const qb = await this.getQueryBuilder();

      return ((
        await qb("products")
          .select(this.getPrivateColumns())
          .leftJoin("category", "products.category_id", "category.category_id")
          .where("products.sku", sku)
          .where("products.is_deleted", false)
          .first()) || null
      );
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async findByBarcode(barcode) {
    try {
      const qb = await this.getQueryBuilder();

      return (
        (await qb("products")
          .select(this.getPublicColumns())
          .where({ barcode, is_deleted: false })
          .first()) || null
      );
      const product = await qb(this.tableName)
        .select(this.getPublicColumns())
        .where(this.whereStatement({ sku }))
        .first();

      return product ? this.normalizeProduct(product) : null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * ✅ NEW: Get products by Category with STOCK QUANTITY (subquery)
   */
  async findByCategoryIdWithStockPaginated(category_id, page = 1, limit = 10) {
    try {
      const qb = await this.getQueryBuilder();
      const offset = (page - 1) * limit;

      const data = await qb("products")
        .select([
          "products.product_id",
          "products.name",
          "products.description",
          "products.sku",
          "products.product_image",
          "products.category_id",
          "category.category_name as category_name",
          qb.raw(
            "(SELECT count(*) FROM items WHERE items.product_id = products.product_id AND items.status = 'available') as stock_quantity"
          ),
        ])
        .leftJoin("category", "products.category_id", "category.category_id")
        .where({
          "products.category_id": category_id,
          "products.is_deleted": false,
        })
        .orderBy("products.product_id", "asc")
        .limit(limit)
        .offset(offset);

      const [{ count }] = await qb("products")
        .where({
          category_id,
          is_deleted: false,
        })
        .count("* as count");

      return {
        data,
        total: Number(count),
      };
      const product = await qb(this.tableName)
        .select(this.getPublicColumns())
        .where(this.whereStatement({ barcode }))
        .first();

      return product ? this.normalizeProduct(product) : null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

module.exports = ProductModel;
