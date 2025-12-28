require("dotenv").config();

const VendorModel = require("../../models/VendorModel");
const vendorSchema = require("../../validators/vendorValidator");
const JoiValidatorError = require("../../errorhandlers/JoiValidationError");

class VendorManager {

  /* -------------------------------------------------
     VALIDATE INPUT
     ------------------------------------------------- */
  static validate(schema, data) {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const patchedError = {
        ...error,
        details: error.details.map(detail => {
          if (detail.type === "object.min" && detail.path.length === 0) {
            return {
              ...detail,
              path: Object.keys(schema.describe().keys)
            };
          }
          return detail;
        })
      };

      throw new JoiValidatorError(patchedError);
    }

    return value;
  }

  /* -------------------------------------------------
     CRUD
     ------------------------------------------------- */

static async getAllVendorsPaginated(page, limit) {
  try {
    const vendorModel = new VendorModel();
    const result = await vendorModel.getAllVendorsPaginated(page, limit);

    const totalPages = Math.ceil(result.total / limit);
    const offset = (page - 1) * limit;

    return {
      vendors: result.data,
      total: result.total,
      page,
      limit,
      offset,
      totalPages,
      previous: page > 1 ? page - 1 : null,
      next: page < totalPages ? page + 1 : null
    };
  } catch (err) {
    throw new Error(`Failed to fetch vendors: ${err.message}`);
  }
}


  static async getVendorById(params) {
    const { id } = this.validate(vendorSchema.id, params);

    const vendorModel = new VendorModel();
    const vendor = await vendorModel.getVendorById(id);

    if (!vendor) {
      throw new JoiValidatorError({
        details: [
          { path: ["id"], message: "Vendor not found" }
        ]
      });
    }

    return vendor;
  }

  static async createVendor(payload) {
    const data = this.validate(vendorSchema.create, payload);

    const vendorModel = new VendorModel();

    // Check if vendor with same name already exists
    const allVendors = await vendorModel.getAllVendors();
    const duplicate = allVendors.find(
      v => v.vendor_name.toLowerCase() === data.vendor_name.toLowerCase()
    );

    if (duplicate) {
      throw new JoiValidatorError({
        details: [
          { path: ["vendor_name"], message: "Vendor already exists" }
        ]
      });
    }

    return await vendorModel.createVendor(data);
  }

  static async updateVendor(params, body) {
    const { id } = this.validate(vendorSchema.id, params);
    const updateBody = this.validate(vendorSchema.update, body);

    const vendorModel = new VendorModel();
    const vendor = await vendorModel.updateVendor(id, updateBody);

    if (!vendor) {
      throw new JoiValidatorError({
        details: [
          { path: ["id"], message: "Vendor not found or no update data" }
        ]
      });
    }

    return vendor;
  }

  static async deleteVendor(params) {
    const { id } = this.validate(vendorSchema.id, params);

    const vendorModel = new VendorModel();
    const deleted = await vendorModel.deleteVendor(id);

    if (!deleted) {
      throw new JoiValidatorError({
        details: [
          { path: ["id"], message: "Vendor not found or already deleted" }
        ]
      });
    }

    return deleted;
  }
}

module.exports = VendorManager;
