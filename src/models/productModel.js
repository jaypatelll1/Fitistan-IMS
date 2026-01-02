const BaseModel = require("../models/libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const { TABLE_DEFAULTS } = require("../models/libs/dbConstants");

class ProductModel extends BaseModel {
  constructor(userId) {
    super(userId);
    this.tableName = "products";
  }

  /**
   * Fields exposed to API responses
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
    ];
  }

  /**
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

      const data = await qb(this.tableName)
        .select(this.getPublicColumns())
        .where(this.whereStatement())
        .orderBy("product_id", "asc")
        .limit(limit)
        .offset(offset);

      const [{ count }] = await qb(this.tableName)
        .where(this.whereStatement())
        .count("* as count");

      return {
        data: data.map(this.normalizeProduct),
        total: Number(count),
      };
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // Get products by category ID with pagination
  async findByCategoryIdPaginated(category_id, page = 1, limit = 10) {
    try {
      const qb = await this.getQueryBuilder();
      const offset = (page - 1) * limit;

      const data = await qb(this.tableName)
        .select(this.getPublicColumns())
        .where(this.whereStatement({ category_id }))
        .orderBy("product_id", "asc")
        .limit(limit)
        .offset(offset);

      const [{ count }] = await qb(this.tableName)
        .where(this.whereStatement({ category_id }))
        .count("* as count");

      return {
        data: data.map(this.normalizeProduct),
        total: Number(count),
      };
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

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

  // Count products by category ID
  async countByCategoryId(category_id) {
    try {
      const qb = await this.getQueryBuilder();
      const [{ count }] = await qb(this.tableName)
        .where(this.whereStatement({ category_id }))
        .count("* as count");

      return Number(count);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * Create product
   */
  async create(productData) {
    try {
      const qb = await this.getQueryBuilder();

      // Normalize JSONB fields
      if (!productData.product_image) productData.product_image = [];
      if (!productData.barcode_image) productData.barcode_image = null;

      const data = this.insertStatement(productData);

      const [product] = await qb(this.tableName)
        .insert(data)
        .returning(this.getPublicColumns());

      return product ? this.normalizeProduct(product) : null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * Update product
   */
  async update(product_id, productData) {
    try {
      const qb = await this.getQueryBuilder();
      const data = await this.updateStatement(productData);

      if (!data || Object.keys(data).length === 0) return null;

      // If fields not provided, leave them undefined
      if (data.product_image === undefined) data.product_image = undefined;
      if (data.barcode_image === undefined) data.barcode_image = undefined;

      const [updatedProduct] = await qb(this.tableName)
        .where(this.whereStatement({ product_id }))
        .update({
          ...data,
          [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP"),
        })
        .returning(this.getPublicColumns());

      return updatedProduct ? this.normalizeProduct(updatedProduct) : null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * Soft delete product
   */
  async softDelete(product_id) {
    try {
      const qb = await this.getQueryBuilder();
      return await qb(this.tableName)
        .where(this.whereStatement({ product_id }))
        .update({
          [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: true,
          [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP"),
        });
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * Find product by SKU
   */
  async findBySkuId(sku) {
    try {
      const qb = await this.getQueryBuilder();
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
   * Find product by barcode
   */
  async generateBarcode(barcode) {
    try {
      const qb = await this.getQueryBuilder();
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
