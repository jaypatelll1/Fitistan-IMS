// src/models/variant.model.js

const db = require("../config/database");

class VariantModel {
  static async findAll(filters = {}) {
    let query = db("product_variants as v")
      .join("products as p", "v.product_id", "p.product_id")
      .select("v.*", "p.product_name", "p.category", "p.vendor_id");

    if (filters.product_id) {
      query = query.where("v.product_id", filters.product_id);
    }

    if (filters.status) {
      query = query.where("v.status", filters.status);
    }

    return query.orderBy("v.created_at", "desc");
  }

  static async findById(variantId) {
    return db("product_variants as v")
      .join("products as p", "v.product_id", "p.product_id")
      .where("v.variant_id", variantId)
      .select("v.*", "p.product_name", "p.category", "p.vendor_id")
      .first();
  }

  static async findBySKU(sku) {
    return db("product_variants").where({ sku }).first();
  }

  static async findByBarcode(barcode) {
    return db("product_variants as v")
      .join("products as p", "v.product_id", "p.product_id")
      .where("v.barcode", barcode)
      .select("v.*", "p.product_name", "p.category")
      .first();
  }

  static async create(variantData) {
    const [variant] = await db("product_variants")
      .insert(variantData)
      .returning("*");
    return variant;
  }

  static async update(variantId, variantData) {
    const [variant] = await db("product_variants")
      .where({ variant_id: variantId })
      .update({ ...variantData, updated_at: db.fn.now() })
      .returning("*");
    return variant;
  }

  static async delete(variantId) {
    return this.update(variantId, { status: "discontinued" });
  }

  static async checkBarcodeUnique(barcode, excludeVariantId = null) {
    let query = db("product_variants").where({ barcode });

    if (excludeVariantId) {
      query = query.whereNot({ variant_id: excludeVariantId });
    }

    const existing = await query.first();
    return !existing;
  }

  static async checkSKUUnique(sku, excludeVariantId = null) {
    let query = db("product_variants").where({ sku });

    if (excludeVariantId) {
      query = query.whereNot({ variant_id: excludeVariantId });
    }

    const existing = await query.first();
    return !existing;
  }
}

module.exports = VariantModel;
