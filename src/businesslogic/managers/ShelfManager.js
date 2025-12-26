require("dotenv").config();

const ShelfModel = require("../../models/shelfModel");
const RoomModel = require("../../models/RoomModel");
const shelfSchema = require("../../validators/shelfValidator");
const JoiValidatorError = require("../../errorhandlers/JoiValidationError");

class ShelfManager {

  
  static validate(schema, data) {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      // Patch object.min(1) error to show allowed keys
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

  

 static async getAllShelfPaginated(page, limit) {
  try {
    const shelfModel = new ShelfModel();
    const result = await shelfModel.getAllShelfPaginated(page, limit);

    const totalPages = Math.ceil(result.total / limit);
    const offset = (page - 1) * limit;

    return {
      shelfs: result.data,
      total: result.total,
      page,
      limit,
      offset,
      totalPages,
      previous: page > 1 ? page - 1 : null,
      next: page < totalPages ? page + 1 : null
    };
  } catch (err) {
    throw new Error(`Failed to fetch shelves: ${err.message}`);
  }
}


  static async createShelf(payload) {
    const data = this.validate(shelfSchema.create, payload);

    // Business rule: room must exist and not be deleted
    const roomModel = new RoomModel();
    const room = await roomModel.getRoomById(data.room_id);

    if (!room) {
      throw new JoiValidatorError({
        details: [
          {
            path: ["room_id"],
            message: "Cannot create shelf in a deleted or non-existing room"
          }
        ]
      });
    }

    const shelfModel = new ShelfModel();
    return await shelfModel.createShelf(data);
  }

  static async getShelfById(params) {
    const { id } = this.validate(shelfSchema.id, params);

    const shelfModel = new ShelfModel();
    return await shelfModel.getShelfById(id);
  }

  static async updateShelf(params, body) {
    const { id } = this.validate(shelfSchema.id, params);
    const updateBody = this.validate(shelfSchema.update, body);

    const shelfModel = new ShelfModel();
    return await shelfModel.updateShelf(id, updateBody);
  }

  static async deleteShelf(params) {
    const { id } = this.validate(shelfSchema.id, params);

    const shelfModel = new ShelfModel();
    return await shelfModel.deleteShelf(id);
  }
}

module.exports = ShelfManager;
