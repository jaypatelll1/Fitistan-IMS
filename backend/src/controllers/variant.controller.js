// src/controllers/variant.controller.js

const VariantModel = require("../models/variant.model");
const BarcodeGenerator = require("../utils/barcodeGenerator");
const ResponseHandler = require("../utils/responseHandler");
const logger = require("../utils/logger");

class VariantController {
  static async create(req, res) {
    try {
      const variantData = req.body;

      // Check if SKU is unique
      const skuExists = await VariantModel.checkSKUUnique(variantData.sku);
      if (!skuExists) {
        return ResponseHandler.error(res, "SKU already exists", 400);
      }

      // Generate unique barcode if not provided
      if (!variantData.barcode) {
        const tempVariant = {
          variant_id: "temp",
          product_name: variantData.product_name || "Product",
          attributes: variantData.attributes || {},
        };

        variantData.barcode = await BarcodeGenerator.generateUniqueBarcode(
          tempVariant.variant_id,
          tempVariant.product_name,
          tempVariant.attributes
        );
      }

      const variant = await VariantModel.create(variantData);

      logger.info(`Variant created with barcode: ${variant.barcode}`);
      return ResponseHandler.success(
        res,
        variant,
        "Variant created successfully",
        201
      );
    } catch (error) {
      logger.error("Create variant error:", error);
      return ResponseHandler.error(res, error.message);
    }
  }

  static async generateBarcode(req, res) {
    try {
      const { id } = req.params;

      // Get variant details
      const variant = await VariantModel.findById(id);
      if (!variant) {
        return ResponseHandler.error(res, "Variant not found", 404);
      }

      // Generate new barcode
      const newBarcode = await BarcodeGenerator.generateUniqueBarcode(
        variant.variant_id,
        variant.product_name,
        variant.attributes
      );

      // Update variant with new barcode
      const updatedVariant = await VariantModel.update(id, {
        barcode: newBarcode,
      });

      logger.info(`Barcode regenerated for variant: ${id}`);
      return ResponseHandler.success(
        res,
        {
          variant: updatedVariant,
          barcode: newBarcode,
          isValid: BarcodeGenerator.verifyEAN13(newBarcode),
        },
        "Barcode generated successfully"
      );
    } catch (error) {
      logger.error("Generate barcode error:", error);
      return ResponseHandler.error(res, error.message);
    }
  }

  static async generateQRCode(req, res) {
    try {
      const { id } = req.params;

      const variant = await VariantModel.findById(id);
      if (!variant) {
        return ResponseHandler.error(res, "Variant not found", 404);
      }

      const qrCode = await BarcodeGenerator.generateQRCode(variant);

      return ResponseHandler.success(
        res,
        {
          variant_id: variant.variant_id,
          sku: variant.sku,
          barcode: variant.barcode,
          qrCode, // Base64 image
        },
        "QR Code generated successfully"
      );
    } catch (error) {
      logger.error("Generate QR code error:", error);
      return ResponseHandler.error(res, error.message);
    }
  }

  static async generatePrintLabel(req, res) {
    try {
      const { id } = req.params;

      const variant = await VariantModel.findById(id);
      if (!variant) {
        return ResponseHandler.error(res, "Variant not found", 404);
      }

      const label = await BarcodeGenerator.generatePrintableLabel(variant);

      return ResponseHandler.success(
        res,
        label,
        "Printable label generated successfully"
      );
    } catch (error) {
      logger.error("Generate label error:", error);
      return ResponseHandler.error(res, error.message);
    }
  }

  static async findByBarcode(req, res) {
    try {
      const { barcode } = req.params;

      const variant = await VariantModel.findByBarcode(barcode);
      if (!variant) {
        return ResponseHandler.error(
          res,
          "Variant not found with this barcode",
          404
        );
      }

      return ResponseHandler.success(res, variant, "Variant found");
    } catch (error) {
      logger.error("Find by barcode error:", error);
      return ResponseHandler.error(res, error.message);
    }
  }
}

module.exports = VariantController;
