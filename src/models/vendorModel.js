const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class VendorModel extends BaseModel {
  constructor(userId) {
    super(userId);
  }

  // 👇 Only expose these fields in responses
  getPublicColumns() {
    return ["vendor_id", "vendor_name", "email", "phone", "address"];
  }

  async getAllVendorsPaginated(page = 1, limit = 10) {
  try {
    const qb = await this.getQueryBuilder();
    const offset = (page - 1) * limit;

    const data = await qb("vendors")
      .select(this.getPublicColumns())
      .where({ is_deleted: false })
      .orderBy("vendor_id", "asc")
      .limit(limit)
      .offset(offset);

    const [{ count }] = await qb("vendors")
      .where({ is_deleted: false })
      .count("* as count");

    return {
      data,
      total: Number(count)
    };
  } catch (e) {
    throw new DatabaseError(e);
  }
}


  async getVendorById(vendor_id) {
    try {
      const qb = await this.getQueryBuilder();
      const vendor = await qb("vendors")
        .select(this.getPublicColumns())
        .where({ vendor_id, is_deleted: false })
        .first();
      return vendor || null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async createVendor(data) {
    try {
      const qb = await this.getQueryBuilder();
      const [vendor] = await qb("vendors")
        .insert({
          vendor_name: data.vendor_name,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
          is_deleted: false
        })
        .returning(this.getPublicColumns());

      return vendor;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async updateVendor(vendor_id, data) {
    try {
      const qb = await this.getQueryBuilder();

      const exists = await qb("vendors")
        .select("vendor_id")
        .where({ vendor_id, is_deleted: false })
        .first();

      if (!exists) return null;

      const [vendor] = await qb("vendors")
        .where({ vendor_id, is_deleted: false })
        .update(data)
        .returning(this.getPublicColumns());

      return vendor;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async deleteVendor(vendor_id) {
    try {
      const qb = await this.getQueryBuilder();

      const exists = await qb("vendors")
        .select("vendor_id")
        .where({ vendor_id, is_deleted: false })
        .first();

      if (!exists) return null;

      const [vendor] = await qb("vendors")
        .where({ vendor_id, is_deleted: false })
        .update({ is_deleted: true })
        .returning(this.getPublicColumns());

      return vendor;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

module.exports = VendorModel;
