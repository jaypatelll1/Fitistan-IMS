const bwipjs = require("bwip-js");

/**
 * Generate barcode PNG buffer from SKU
 * @param {string} sku
 * @returns {Promise<Buffer>}
 */
const generateBarcodeBuffer = (sku) => {
  return new Promise((resolve, reject) => {
    if (!sku) {
      return reject(new Error("SKU is required for barcode"));
    }

    bwipjs.toBuffer(
      {
        bcid: "code128",     // barcode type
        text: sku,           // SKU = barcode value
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      },
      (err, png) => {
        if (err) return reject(err);
        resolve(png);
      }
    );
  });
};

module.exports = {
  generateBarcodeBuffer,
};
