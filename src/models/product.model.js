const { Model } = require("objection");

class Product extends Model {
  static get tableName() {
    return "products";
  }

  static get idColumn() {
    return "product_id";
  }

  // Optional: JSON schema validation
  static get jsonSchema() {
    return {
      type: "object",
      required: ["product_name", "category", "vendor_id"],

      properties: {
        product_id: { type: "string", format: "uuid" },

        product_name: { type: "string", minLength: 1, maxLength: 255 },

        category: {
          type: "string",
          enum: ["tshirt", "bottle", "cap", "bag"]
        },

        description: { type: ["string", "null"] },

        vendor_id: { type: "string", format: "uuid" },

        status: {
          type: "string",
          enum: ["active", "discontinued"],
          default: "active"
        },

        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" }
      }
    };
  }

  // Optional: relations (recommended)
  static get relationMappings() {
    const Vendor = require("./Vendor");

    return {
      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Vendor,
        join: {
          from: "products.vendor_id",
          to: "vendors.vendor_id"
        }
      }
    };
  }
}

module.exports = Product;