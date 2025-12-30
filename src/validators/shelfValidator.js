const Joi = require("joi");
const  COMMON_MESSAGES  = require("../validators/validationConstants/commanMessages");

const shelfSchema = {
  create: Joi.object({
    shelf_name: Joi.string()
      .trim()
      .min(2)
      .max(255)
      .required()
      .label("Shelf name")
      .messages({
        "string.base": COMMON_MESSAGES.STRING_BASE,
        "string.empty": COMMON_MESSAGES.STRING_EMPTY,
        "string.min": COMMON_MESSAGES.STRING_MIN,
        "string.max": COMMON_MESSAGES.STRING_MAX,
        "any.required": COMMON_MESSAGES.ANY_REQUIRED
      }),

    warehouse_id: Joi.number()
      .integer()
      .positive()
      .required()
      .label("Warehouse ID")
      .messages({
        "number.base": COMMON_MESSAGES.NUMBER_BASE,
        "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
        "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
        "any.required": COMMON_MESSAGES.ANY_REQUIRED
      }),

    room_id: Joi.number()
      .integer()
      .positive()
      .required()
      .label("Room ID")
      .messages({
        "number.base": COMMON_MESSAGES.NUMBER_BASE,
        "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
        "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
        "any.required": COMMON_MESSAGES.ANY_REQUIRED
      }),

    capacity: Joi.number()
      .integer()
      .positive()
      .label("Capacity")
      .messages({
        "number.base": COMMON_MESSAGES.NUMBER_BASE,
        "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
        "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE
      })
      .optional()
  }),

  update: Joi.object({
    shelf_name: Joi.string()
      .trim()
      .min(2)
      .max(255)
      .label("Shelf name")
      .messages({
        "string.base": COMMON_MESSAGES.STRING_BASE,
        "string.empty": COMMON_MESSAGES.STRING_EMPTY,
        "string.min": COMMON_MESSAGES.STRING_MIN,
        "string.max": COMMON_MESSAGES.STRING_MAX
      }),

    warehouse_id: Joi.number()
      .integer()
      .positive()
      .label("Warehouse ID")
      .messages({
        "number.base": COMMON_MESSAGES.NUMBER_BASE,
        "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
        "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE
      }),

    room_id: Joi.number()
      .integer()
      .positive()
      .label("Room ID")
      .messages({
        "number.base": COMMON_MESSAGES.NUMBER_BASE,
        "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
        "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE
      }),

    capacity: Joi.number()
      .integer()
      .positive()
      .label("Capacity")
      .messages({
        "number.base": COMMON_MESSAGES.NUMBER_BASE,
        "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
        "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE
      })
  }).min(1),

  id: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .label("Shelf ID")
      .messages({
        "number.base": COMMON_MESSAGES.NUMBER_BASE,
        "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
        "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
        "any.required": COMMON_MESSAGES.ANY_REQUIRED
      })
  })
};

module.exports = shelfSchema;
