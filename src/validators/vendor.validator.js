const Joi = require("joi");

const vendorSchema = {
  create: Joi.object({
    vendor_name: Joi.string().trim().min(2).max(255).required(),
    email: Joi.string().email().max(255).required(),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .max(50)
      .allow(null, ""),
    address: Joi.string().trim().min(10).max(1000).required()
  }),

  update: Joi.object({
    vendor_name: Joi.string().trim().min(2).max(255),
    email: Joi.string().email().max(255),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .max(50)
      .allow(null, ""),
    address: Joi.string().trim().max(1000).allow(null, "")
  }).min(1),

  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

const validateVendor = (schema) => {
  return (req, res, next) => {
    const data = schema === "id" ? req.params : req.body;

    const { error, value } = vendorSchema[schema].validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map(d => ({
          field: d.path[0],
          message: d.message
        }))
      });
    }

    if (!req.validatedData) req.validatedData = {};

    if (schema === "create") req.validatedData = value;
    if (schema === "update") req.validatedData.updateBody = value;
    if (schema === "id") req.validatedData.id = value.id;

    next();
  };
};

module.exports = validateVendor;
