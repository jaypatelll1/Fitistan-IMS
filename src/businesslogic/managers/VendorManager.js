const VendorModel = require("../../models/vendormodel");

class VendorManager {

  static async createVendor(data, userId) {
    const vendorModel = new VendorModel(userId);
    return vendorModel.createVendor(data);
  }

  static async getVendors(userId) {
    const vendorModel = new VendorModel(userId);
    return vendorModel.getAllVendors();
  }

  static async getVendor(id, userId) {
    const vendorModel = new VendorModel(userId);
    return vendorModel.getVendorById(id);
  }

  // UPDATE ✅
  static async updateVendor(id, updateData, userId) {
    const vendorModel = new VendorModel(userId);
    return vendorModel.updateVendor(id, updateData);
  }

  static async deleteVendor(id, userId) {
    const vendorModel = new VendorModel(userId);
    return vendorModel.deleteVendor(id);
  }
}

module.exports = VendorManager;
