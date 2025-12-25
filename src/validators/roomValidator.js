const Joi = require("joi");
const ValidationError = require("../errorhandlers/ValidationError");

const roomSchema = {
  create: Joi.object({
    room_name: Joi.string().trim().min(2).max(255).required(),
    warehouse_id: Joi.number().integer().positive().required()
  }),
  update: Joi.object({
    room_name: Joi.string().trim().min(2).max(255),
    warehouse_id: Joi.number().integer().positive()
  }).min(1),
  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

const validateRoom = (schema) => {
  return (req, res, next) => {
    const data = schema === "id" ? req.params : req.body;

    const { error, value } = roomSchema[schema].validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    // if (error) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Validation error",
    //     errors: error.details.map(d => ({
    //       field: d.path[0],
    //       message: d.message
    //     }))
    //   });
    // }

    if (error) {
      const vError = new ValidationError(error);
      return res.status(vError.status).json(vError.response);
    }

    if (!req.validatedData) req.validatedData = {};
    if (schema === "update") req.validatedData.updateBody = value;
    if (schema === "id") req.validatedData.id = value.id;
    if (schema === "create") req.validatedData = value;

    next();
  };
};

module.exports = validateRoom;
