const Joi = require("joi");

// REGISTER VALIDATION
const registerSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
    profile_picture_url: Joi.string().uri().optional(),
    role_id: Joi.number().integer().positive().required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
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

  next();
};

// LOGIN VALIDATION
const loginSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
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

  next();
};

module.exports = { registerSchema, loginSchema };
