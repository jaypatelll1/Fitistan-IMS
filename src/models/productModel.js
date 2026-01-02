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

  /**
   * ✅ Get all products with category name
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
        data,
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

  async countByCategoryId(category_id) {
    try {
      const qb = await this.getQueryBuilder();

      const [{ count }] = await qb("products")
        .where({
          category_id,
          is_deleted: false,
        })
        .count("* as count");

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
      const data = this.insertStatement(productData);

      const [product] = await qb("products")
        .insert(data)
        .returning(this.getPublicColumns());

      return product || null;
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

      if (!data || Object.keys(data).length === 0) {
        return null;
      }

      const [updatedProduct] = await qb("products")
        .where({ product_id })
        .update({
          ...data,
          [TABLE_DEFAULTS.COLUMNS.UPDATED_AT.KEY]: qb.raw("CURRENT_TIMESTAMP"),
        })
        .returning(this.getPublicColumns());

      return updatedProduct || null;
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

      return (
        (await qb("products")
          .select(this.getPublicColumns())
          .where({ sku, is_deleted: false })
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
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

module.exports = ProductModel;
