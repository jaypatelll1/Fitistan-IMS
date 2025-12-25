const RoomModel = require("../../models/RoomModel");
const JoiValidatorError = require("../../errorhandlers/JoiValidationError");

const {
  createRoomSchema,
  updateRoomSchema,
  roomIdSchema
} = require("../../validators/roomValidator");

class RoomManager {

  static async getAllRooms(userId) {
    const roomModel = new RoomModel(userId);
    return roomModel.getAllRooms();
  }

  static async getRoomById(id, userId) {
    const { error, value } = roomIdSchema.validate(
      { id },
      { abortEarly: false }
    );

    if (error) throw new JoiValidatorError(error);

    const roomModel = new RoomModel(userId);
    const room = await roomModel.getRoomById(value.id);

    if (!room) {
      return { success: false, message: "Room not found" };
    }

    return room;
  }

static async createRoom(payload, userId) {
  const { error, value } = createRoomSchema.validate(payload, {
      abortEarly: false,
      stripUnknown: true
  });
  if (error) throw new JoiValidatorError(error);

  const roomModel = new RoomModel(userId);

  try {
      const room = await roomModel.createRoom(value);
      return room;
  } catch (e) {
      // Logical errors about room already existing
      if (e.message.includes("Room exists")) {
          throw new JoiValidatorError({
              details: [
                  { path: ["room_name"], message: e.message }
              ]
          });
      }

      // Unexpected database errors
      throw e;
  }
}




  static async updateRoom(id, payload, userId) {
    const idCheck = roomIdSchema.validate({ id }, { abortEarly: false });
    if (idCheck.error) throw new JoiValidatorError(idCheck.error);

    const { error, value } = updateRoomSchema.validate(payload, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) throw new JoiValidatorError(error);

    const roomModel = new RoomModel(userId);
    const room = await roomModel.updateRoom(id, value);

    if (!room) {
      return { success: false, message: "Room not found or no update data" };
    }

    return room;
  }

  static async deleteRoom(id, userId) {
    const { error, value } = roomIdSchema.validate(
      { id },
      { abortEarly: false }
    );

    if (error) throw new JoiValidatorError(error);

    const roomModel = new RoomModel(userId);
    const deleted = await roomModel.deleteRoom(value.id);

    if (!deleted) {
      return { success: false, message: "Room not found or already deleted" };
    }

    return true;
  }
}

module.exports = RoomManager;
