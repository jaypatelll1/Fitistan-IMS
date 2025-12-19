const Variant = require("../models/variant.model");

class VariantController {

  // ================= CREATE VARIANT =================
  static async createVariant(req, res) {
    try {
      const { name, sku, product_id } = req.body;

      // Basic validation
      if (!name || !sku || !product_id) {
        return res.status(400).json({
          success: false,
          message: "name, sku and product_id are required"
        });
      }

      const variant = await Variant.create({
        name,
        sku,
        product_id
      });

      return res.status(201).json({
        success: true,
        message: "Variant created successfully",
        data: variant
      });

    } catch (error) {
      console.error("CREATE VARIANT ERROR 👉", error);

      // ✅ Postgres duplicate key (SKU unique)
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "SKU already exists"
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // ================= GET ALL VARIANTS =================
  static async getAllVariants(req, res) {
    try {
      const variants = await Variant.findAll(req.query);

      return res.status(200).json({
        success: true,
        data: variants
      });

    } catch (error) {
      console.error("GET VARIANTS ERROR 👉", error.message);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // ================= GET VARIANT BY ID =================
  static async getVariantById(req, res) {
    try {
      const { id } = req.params;

      const variant = await Variant.findById(id);

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Variant not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: variant
      });

    } catch (error) {
      console.error("GET VARIANT ERROR 👉", error.message);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // ================= FIND VARIANT BY BARCODE =================
  static async findByBarcode(req, res) {
    try {
      const { barcode } = req.params;

      const variant = await Variant.findByBarcode(barcode);

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Variant not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: variant
      });

    } catch (error) {
      console.error("BARCODE SEARCH ERROR 👉", error.message);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // ================= UPDATE VARIANT =================
  static async updateVariant(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const updatedVariant = await Variant.update(id, data);

      return res.status(200).json({
        success: true,
        message: "Variant updated successfully",
        data: updatedVariant
      });

    } catch (error) {
      console.error("UPDATE VARIANT ERROR 👉", error);

      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "SKU already exists"
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // ================= DELETE VARIANT =================
  static async deleteVariant(req, res) {
    try {
      const { id } = req.params;

      await Variant.delete(id);

      return res.status(200).json({
        success: true,
        message: "Variant deleted successfully"
      });

    } catch (error) {
      console.error("DELETE VARIANT ERROR 👉", error.message);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // ================= GENERATE BARCODE =================
  static async generateBarcode(req, res) {
    try {
      const { id } = req.params;

      const barcode = await Variant.generateBarcode(id);

      return res.status(200).json({
        success: true,
        barcode
      });

    } catch (error) {
      console.error("GENERATE BARCODE ERROR 👉", error.message);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = VariantController;
