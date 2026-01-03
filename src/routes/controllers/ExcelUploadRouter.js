const ExcelUploadManager = require("../../businesslogic/managers/ExcelUploadManager");

class ExcelUploadRouter {
  static async uploadProducts(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Excel file is required" });
      }

      const result = await ExcelUploadManager.importProducts(req.file.path);

      res.status(201).json({
        message: "Excel data imported successfully",
        insertedRecords: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExcelUploadRouter;
