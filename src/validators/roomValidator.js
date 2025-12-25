const Joi = require("joi");

const createRoomSchema = Joi.object({
  room_name: Joi.string().trim().min(2).max(255).required(),
  warehouse_id: Joi.number().integer().positive().required()
});

const updateRoomSchema = Joi.object({
  room_name: Joi.string().trim().min(2).max(255),
  warehouse_id: Joi.number().integer().positive()
}).min(1);

const roomIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
  roomIdSchema
};
