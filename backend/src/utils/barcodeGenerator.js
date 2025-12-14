// src/utils/barcodeGenerator.js

const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");
const logger = require("./logger");

class BarcodeGenerator {
  /**
   * Generate EAN-13 Barcode with checksum
   * Format: 978 (prefix) + 9 digits (variant-specific) + 1 checksum
   * @returns {string} 13-digit EAN-13 barcode
   */
  static generateEAN13() {
    // Prefix: 978 (commonly used for products)
    const prefix = "978";

    // Generate 9 random digits
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0"); // 3 random digits

    // 12-digit code without checksum
    const codeWithoutChecksum = prefix + timestamp + random;

    // Calculate checksum digit
    const checksum = this.calculateEAN13Checksum(codeWithoutChecksum);

    // Final 13-digit barcode
    return codeWithoutChecksum + checksum;
  }

  /**
   * Calculate EAN-13 checksum digit
   * Algorithm: (10 - [(3 * sum_odd + sum_even) % 10]) % 10
   * @param {string} code - 12-digit code without checksum
   * @returns {string} Single checksum digit
   */
  static calculateEAN13Checksum(code) {
    if (code.length !== 12) {
      throw new Error("Code must be exactly 12 digits for EAN-13 checksum");
    }

    let oddSum = 0;
    let evenSum = 0;

    // Sum digits at odd and even positions (1-indexed from right)
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(code[i]);
      if (i % 2 === 0) {
        oddSum += digit;
      } else {
        evenSum += digit;
      }
    }

    // EAN-13 checksum formula
    const checksum = (10 - ((oddSum + evenSum * 3) % 10)) % 10;
    return checksum.toString();
  }

  /**
   * Verify if an EAN-13 barcode is valid
   * @param {string} barcode - 13-digit barcode
   * @returns {boolean} True if valid
   */
  static verifyEAN13(barcode) {
    if (!barcode || barcode.length !== 13) {
      return false;
    }

    const codeWithoutChecksum = barcode.slice(0, 12);
    const providedChecksum = barcode[12];
    const calculatedChecksum = this.calculateEAN13Checksum(codeWithoutChecksum);

    return providedChecksum === calculatedChecksum;
  }

  /**
   * Generate unique barcode for a variant
   * Ensures no collision with existing barcodes
   * @param {string} variantId - UUID of the variant
   * @param {string} productName - Name of the product
   * @param {object} attributes - Variant attributes (size, color, etc.)
   * @returns {Promise<string>} Unique EAN-13 barcode
   */
  static async generateUniqueBarcode(variantId, productName, attributes) {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const barcode = this.generateEAN13();

      // Check if barcode already exists in database
      const existing = await db("product_variants").where({ barcode }).first();

      if (!existing) {
        logger.info(
          `Generated unique barcode: ${barcode} for variant: ${variantId}`
        );
        return barcode;
      }

      attempts++;
      logger.warn(
        `Barcode collision detected (attempt ${attempts}): ${barcode}`
      );
    }

    throw new Error("Failed to generate unique barcode after maximum attempts");
  }

  /**
   * Generate QR Code for variant
   * Contains variant information in JSON format
   * @param {object} variantData - Complete variant data
   * @returns {Promise<string>} Base64 encoded QR code image
   */
  static async generateQRCode(variantData) {
    try {
      const qrData = {
        variant_id: variantData.variant_id,
        sku: variantData.sku,
        barcode: variantData.barcode,
        product_name: variantData.product_name,
        variant_name: variantData.variant_name,
        attributes: variantData.attributes,
        category: variantData.category,
        timestamp: new Date().toISOString(),
      };

      // Generate QR code as base64 data URL
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: "H", // High error correction
        type: "image/png",
        width: 300,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      logger.info(`QR Code generated for variant: ${variantData.variant_id}`);
      return qrCodeDataUrl;
    } catch (error) {
      logger.error("QR Code generation failed:", error);
      throw new Error("Failed to generate QR Code");
    }
  }

  /**
   * Generate QR Code as SVG (better for printing)
   * @param {object} variantData - Complete variant data
   * @returns {Promise<string>} SVG string
   */
  static async generateQRCodeSVG(variantData) {
    try {
      const qrData = {
        variant_id: variantData.variant_id,
        sku: variantData.sku,
        barcode: variantData.barcode,
        product_name: variantData.product_name,
        variant_name: variantData.variant_name,
        attributes: variantData.attributes,
      };

      const qrCodeSVG = await QRCode.toString(JSON.stringify(qrData), {
        type: "svg",
        errorCorrectionLevel: "H",
        width: 300,
      });

      return qrCodeSVG;
    } catch (error) {
      logger.error("QR Code SVG generation failed:", error);
      throw new Error("Failed to generate QR Code SVG");
    }
  }

  /**
   * Generate barcode based on product category and attributes
   * Different prefixes for different categories
   * @param {string} category - Product category (tshirt, bottle, cap, bag)
   * @param {object} attributes - Variant attributes
   * @returns {string} Category-specific barcode
   */
  static generateCategoryBarcode(category, attributes) {
    const categoryPrefixes = {
      tshirt: "100",
      bottle: "200",
      cap: "300",
      bag: "400",
    };

    const prefix = categoryPrefixes[category] || "900"; // 900 for unknown

    // Encode size/color into barcode
    let sizeCode = "00";
    if (attributes.size) {
      const sizeMap = {
        XS: "01",
        S: "02",
        M: "03",
        L: "04",
        XL: "05",
        XXL: "06",
      };
      sizeCode = sizeMap[attributes.size] || "00";
    }

    const timestamp = Date.now().toString().slice(-5);
    const random = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");

    const codeWithoutChecksum = prefix + sizeCode + timestamp + random;
    const checksum = this.calculateEAN13Checksum(codeWithoutChecksum);

    return codeWithoutChecksum + checksum;
  }

  /**
   * Parse barcode to extract information
   * @param {string} barcode - 13-digit EAN-13 barcode
   * @returns {object} Extracted information
   */
  static parseBarcode(barcode) {
    if (!this.verifyEAN13(barcode)) {
      throw new Error("Invalid barcode checksum");
    }

    const prefix = barcode.slice(0, 3);
    const categoryMap = {
      100: "tshirt",
      200: "bottle",
      300: "cap",
      400: "bag",
      900: "unknown",
    };

    return {
      isValid: true,
      prefix,
      category: categoryMap[prefix] || "generic",
      fullCode: barcode,
      checksum: barcode[12],
    };
  }

  /**
   * Generate printable barcode labels
   * Returns data needed for printing labels
   * @param {object} variantData - Variant data
   * @returns {Promise<object>} Barcode and QR code for printing
   */
  static async generatePrintableLabel(variantData) {
    try {
      const barcode =
        variantData.barcode ||
        (await this.generateUniqueBarcode(
          variantData.variant_id,
          variantData.product_name,
          variantData.attributes
        ));

      const qrCodeImage = await this.generateQRCode(variantData);
      const qrCodeSVG = await this.generateQRCodeSVG(variantData);

      return {
        barcode,
        barcodeValid: this.verifyEAN13(barcode),
        qrCodeImage, // Base64 PNG for web display
        qrCodeSVG, // SVG for high-quality printing
        variantInfo: {
          name: variantData.variant_name,
          sku: variantData.sku,
          attributes: variantData.attributes,
          category: variantData.category,
        },
      };
    } catch (error) {
      logger.error("Label generation failed:", error);
      throw error;
    }
  }
}

module.exports = BarcodeGenerator;
