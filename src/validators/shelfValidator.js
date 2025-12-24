const Joi = require("joi");
const ValidationError = require("../errorhandlers/ValidationError");

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
  }).min(1), // 👈 at least one field required

  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

const validateShelf = (schema) => {
  return (req, res, next) => {
    const data = schema === "id" ? req.params : req.body;

    const { error, value } = shelfSchema[schema].validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const vError = new ValidationError(error);
      return res.status(vError.status).json(vError.response);
    }

    // attach validated data (same pattern as Room)
    if (!req.validatedData) req.validatedData = {};

    if (schema === "create") req.validatedData = value;
    if (schema === "update") req.validatedData.updateBody = value;
    if (schema === "id") req.validatedData.id = value.id;

    next();
  };
};

module.exports = validateShelf;
