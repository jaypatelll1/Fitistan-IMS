// src/validators/user.validator.js
const Joi = require("joi");

const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid("admin", "manager", "staff", "viewer")
    .required()
    .messages({
      "any.only": "Role must be one of: admin, manager, staff, viewer",
    }),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("active", "inactive", "suspended")
    .required()
    .messages({
      "any.only": "Status must be one of: active, inactive, suspended",
    }),
});

module.exports = {
  updateRoleSchema,
  updateStatusSchema,
};
