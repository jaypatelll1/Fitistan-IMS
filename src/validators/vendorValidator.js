const Joi = require("joi");

const vendorSchema = {
  create: Joi.object({
    vendor_name: Joi.string().trim().min(2).max(255).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().min(10).max(15).optional(),
    address: Joi.string().max(500).optional()
  }),

  update: Joi.object({
    vendor_name: Joi.string().trim().min(2).max(255),
    email: Joi.string().email(),
    phone: Joi.string().min(10).max(15),
    address: Joi.string().max(500)
  }).min(1),

  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

module.exports = vendorSchema;