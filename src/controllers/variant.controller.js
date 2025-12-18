const Variant = require("../models/variant.model");

class VariantController {

  // ================= CREATE VARIANT =================
  static async createVariant(req, res) {
    try {
      const data = req.body;

      // basic validation (optional but recommended)
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Request body is empty"
        });
      }

      const variant = await Variant.create(data);

      return res.status(201).json({
        success: true,
        message: "Variant created successfully",
        data: variant
      });

    } catch (error) {
      console.error("CREATE VARIANT ERROR 👉", error.message);
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message   // 👈 shows real DB error
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

      const updated = await Variant.update(id, data);

      return res.status(200).json({
        success: true,
        message: "Variant updated successfully",
        data: updated
      });

    } catch (error) {
      console.error("UPDATE VARIANT ERROR 👉", error.message);

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
