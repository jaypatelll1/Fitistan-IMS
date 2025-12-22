const VendorManager = require("../../businesslogic/managers/VendorManager");
const DatabaseError = require("../../errorhandlers/DatabaseError");

class VendorController {

  static async create(req) {
    try {
      return await VendorManager.createVendor(
        req.validatedData,
        req.user?.id
      );
    } catch (err) {
      throw err instanceof DatabaseError ? err : new DatabaseError(err);
    }
  }

  static async list(req) {
    try {
      return await VendorManager.getVendors(req.user?.id);
    } catch (err) {
      throw err instanceof DatabaseError ? err : new DatabaseError(err);
    }
  }

  static async get(req) {
    try {
      return await VendorManager.getVendor(
        req.validatedData.id,
        req.user?.id
      );
    } catch (err) {
      throw err instanceof DatabaseError ? err : new DatabaseError(err);
    }
  }

  // UPDATE ✅
  static async update(req) {
    try {
      const id = req.validatedData.id;
      const updateData = req.validatedData.updateBody;

      if (!updateData || Object.keys(updateData).length === 0) {
        return {
          success: false,
          message: "No fields provided to update"
        };
      }

      const updatedVendor = await VendorManager.updateVendor(
        id,
        updateData,
        req.user?.id
      );

      if (!updatedVendor) {
        return {
          success: false,
          message: "Vendor not found"
        };
      }

      return {
        success: true,
        message: "Vendor updated successfully",
        data: updatedVendor
      };
    } catch (err) {
      throw err instanceof DatabaseError ? err : new DatabaseError(err);
    }
  }

  static async remove(req) {
    try {
      return await VendorManager.deleteVendor(
        req.validatedData.id,
        req.user?.id
      );
    } catch (err) {
      throw err instanceof DatabaseError ? err : new DatabaseError(err);
    }
  }
}

module.exports = VendorController;
