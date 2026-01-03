const xlsx = require("xlsx");
const ProductModel = require("../../models/productModel");
const fs = require("fs");

class ExcelUploadManager {
  static async importProducts(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = xlsx.utils.sheet_to_json(sheet);

    let insertedCount = 0;

    for (const row of rows) {
      if (!row.name || !row.price) continue;

      await ProductModel.createProduct({
        name: row.name,
        price: row.price,
        quantity: row.quantity || 0,
        sku: row.sku
      });

      insertedCount++;
    }

    // cleanup uploaded file
    fs.unlinkSync(filePath);

    return insertedCount;
  }
}

module.exports = ExcelUploadManager;
