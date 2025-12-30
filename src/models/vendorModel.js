const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class VendorModel extends BaseModel {
  constructor(userId) {
    super(userId);
  }

  async createVendor(data) {
    try {
      const qb = await this.getQueryBuilder();

      const [vendor] = await qb("vendors")
        .insert({
          vendor_name: data.vendor_name,
          email: data.email,
          phone: data.phone || null,
          address: data.address,
          is_deleted: false
        })
        .returning("*");

      return vendor;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async getAllVendors() {
    try {
      const qb = await this.getQueryBuilder();
      return qb("vendors").where(
        this.whereStatement({ is_deleted: false })
      );
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async getVendorById(id) {
    try {
      const qb = await this.getQueryBuilder();
      return qb("vendors")
        .where(this.whereStatement({ vendor_id: id, is_deleted: false }))
        .first();
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // UPDATE ✅
  async updateVendor(id, data) {
    try {
      if (!data || Object.keys(data).length === 0) return null;

      const qb = await this.getQueryBuilder();
      const [vendor] = await qb("vendors")
        .where({ vendor_id: id, is_deleted: false })
        .update(data)
        .returning("*");

      return vendor;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async deleteVendor(id) {
    try {
      const qb = await this.getQueryBuilder();
      return qb("vendors")
        .where({ vendor_id: id })
        .update({ is_deleted: true });
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

module.exports = VendorModel;
