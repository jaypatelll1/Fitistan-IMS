const db = require("../config/database");

class VariantModel {

  // CREATE VARIANT
  static async create(data) {

    // 1️⃣ Check SKU uniqueness
    if (data.sku) {
      const existingSku = await db("variants")
        .where({ sku: data.sku })
        .first();

      if (existingSku) {
        throw new Error("SKU already exists");
      }
    }

    const [variant] = await db("variants")
      .insert({
        name: data.name,
        sku: data.sku,
        product_id: data.product_id
      })
      .returning("*");

    return variant;
  }

  // GET ALL VARIANTS
  static async findAll(filters = {}) {
    let query = db("variants").select("*");

    if (filters.product_id) {
      query.where({ product_id: filters.product_id });
    }

    return query.orderBy("variant_id", "desc");
  }

  // GET BY ID
  static async findById(id) {
    return db("variants")
      .where({ variant_id: id })
      .first();
  }

  // FIND BY BARCODE
  static async findByBarcode(barcode) {
    return db("variants")
      .where({ barcode })
      .first();
  }

  // UPDATE
  static async update(id, data) {
    const [updated] = await db("variants")
      .where({ variant_id: id })
      .update(data)
      .returning("*");

    return updated;
  }

  // DELETE
  static async delete(id) {
    return db("variants")
      .where({ variant_id: id })
      .del();
  }

  // GENERATE BARCODE
  static async generateBarcode(id) {
    const barcode = `VAR-${Date.now()}`;

    await db("variants")
      .where({ variant_id: id })
      .update({ barcode });

    return barcode;
  }
}

module.exports = VariantModel;
