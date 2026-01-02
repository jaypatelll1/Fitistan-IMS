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
      "size",
      "category_name",
      "products.category_id"
    ];
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
        .join("category", "products.category_id", "category.category_id")
        .where("products.is_deleted", false)
        .orderBy("product_id", "asc")
        .limit(limit)
        .offset(offset);

      const [{ count }] = await qb(this.tableName)
        .join("category", "products.category_id", "category.category_id")
        .where("products.is_deleted", false)
        .count("* as count");

      return {
        data,
        total: Number(count),
      };
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // Get products by category ID with pagination
  async findByCategoryIdPaginated(category_id, page = 1, limit = 10) {
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
      data,
      total: Number(count)
    };
  }


  // Count total products
  async countTotalProducts() {
    try {
      const qb = await this.getQueryBuilder();

      const [{ count }] = await qb(this.tableName)
        .where(this.whereStatement()) // respects is_deleted
        .count("* as count");

      return Number(count);
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  /**
   * Get product by ID
   */
  async findById(product_id) {
    try {
      const qb = await this.getQueryBuilder();
      return (
        qb(this.tableName)
          .select(this.getPublicColumns())
          .leftJoin("category", "products.category_id", "category.category_id")
          .where("products.is_deleted", false)
          .where({ "products.product_id": product_id })
          .first() || null
      );
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
  // count products by category id
  async countByCategoryId(category_id) {
    const qb = await this.getQueryBuilder();

    const [{ count }] = await qb(this.tableName)
      .where(this.whereStatement({ category_id }))
      .count("* as count")


    return Number(count);
  }

  /**
   * Create product
   */
  async create(productData) {
    try {
      const qb = await this.getQueryBuilder();
      const data = this.insertStatement(productData);

      const [product] = await qb(this.tableName)
        .insert(data)
        .returning(this.getPublicColumns());

      return product || null;
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

      if (!data || Object.keys(data).length === 0) {
        return null;
      }

      const updatedRows = await qb(this.tableName)
        .where(this.whereStatement({ product_id }))
        .update({
          ...data,
          [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP"),
        });

      if (!updatedRows) {
        return null;
      }

      return this.findById(product_id);
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
      return (
        qb(this.tableName)
          .select(this.getPublicColumns())
          .where(this.whereStatement({ sku }))
          .first() || null
      );
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
      return (
        qb(this.tableName)
          .select(this.getPublicColumns())
          .where(this.whereStatement({ barcode }))
          .first() || null
      );
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

module.exports = ProductModel;
