const Joi = require("joi");

const shelfSchema = {
  create: Joi.object({
    shelf_name: Joi.string().trim().min(2).max(255).required(),
    warehouse_id: Joi.number().integer().positive().required(),
    room_id: Joi.number().integer().positive().required(),
    capacity: Joi.number().integer().positive().optional()
  }),

  update: Joi.object({
    shelf_name: Joi.string().trim().min(2).max(255),
    warehouse_id: Joi.number().integer().positive(),
    room_id: Joi.number().integer().positive(),
    capacity: Joi.number().integer().positive()
  }).min(1),

  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

module.exports = shelfSchema;
