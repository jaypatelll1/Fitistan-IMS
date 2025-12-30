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
        scale: 2,          // controls width
        height: 15,        // bar height (mm-ish)
        width:30,        // force total width
        paddingwidth: 10,
        paddingheight: 10,

        includetext: true,
        textsize: 8,
        textxalign: "center",
        textxalign: "center",
        backgroundcolor: "FFFFFF",
        
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
