const db = require("../config/database");

class VariantModel {

  // GET ALL VARIANTS (with optional filters)
  static async findAll(filters = {}) {
    let query = db("product_variants").select("*");

    if (filters.product_id) {
      query = query.where({ product_id: filters.product_id });
    }

    if (filters.status) {
      query = query.where({ status: filters.status });
    }

    return query.orderBy("created_at", "desc");
  }

  // GET VARIANT BY ID
  static async findById(variantId) {
    return db("product_variants")
      .where({ variant_id: variantId })
      .first();
  }

  // FIND VARIANT BY BARCODE
  static async findByBarcode(barcode) {
    return db("product_variants")
      .where({ barcode })
      .first();
  }

  // CREATE VARIANT
  static async create(data) {
    const [variant] = await db("product_variants")
      .insert(data)
      .returning("*");

    return variant;
  }

  // UPDATE VARIANT
  static async update(variantId, data) {
    const [variant] = await db("product_variants")
      .where({ variant_id: variantId })
      .update(
        {
          ...data,
          updated_at: db.fn.now()
        }
      )
      .returning("*");

    return variant;
  }

  // DELETE VARIANT (SOFT DELETE if status column exists)
  static async delete(variantId) {
    return this.update(variantId, { status: "inactive" });
  }

  // GENERATE BARCODE
  static async generateBarcode(variantId) {
    const barcode = `VAR-${Date.now()}`;

    await this.update(variantId, { barcode });

    return barcode;
  }
}

module.exports = VariantModel;
