const Joi = require("joi");
const  COMMON_MESSAGES  = require("../validators/validationConstants/commanMessages");

const vendorSchema = {
  create: Joi.object({
    vendor_name: Joi.string()
      .trim()
      .min(2)
      .max(255)
      .required()
      .label("Vendor name")
      .messages({
        "string.base": COMMON_MESSAGES.STRING_BASE,
        "string.empty": COMMON_MESSAGES.STRING_EMPTY,
        "string.min": COMMON_MESSAGES.STRING_MIN,
        "string.max": COMMON_MESSAGES.STRING_MAX,
        "any.required": COMMON_MESSAGES.ANY_REQUIRED
      }),

    email: Joi.string()
      .email()
      .label("Email")
      .messages({
        "string.email": COMMON_MESSAGES.STRING_EMAIL
      })
      .optional(),

    phone: Joi.string()
      .min(10)
      .max(15)
      .label("Phone number")
      .messages({
        "string.min": COMMON_MESSAGES.STRING_MIN,
        "string.max": COMMON_MESSAGES.STRING_MAX
      })
      .optional(),

    address: Joi.string()
      .max(500)
      .label("Address")
      .messages({
        "string.max": COMMON_MESSAGES.STRING_MAX
      })
      .optional()
  }),

  update: Joi.object({
    vendor_name: Joi.string()
      .trim()
      .min(2)
      .max(255)
      .label("Vendor name")
      .messages({
        "string.base": COMMON_MESSAGES.STRING_BASE,
        "string.empty": COMMON_MESSAGES.STRING_EMPTY,
        "string.min": COMMON_MESSAGES.STRING_MIN,
        "string.max": COMMON_MESSAGES.STRING_MAX
      }),

    email: Joi.string()
      .email()
      .label("Email")
      .messages({
        "string.email": COMMON_MESSAGES.STRING_EMAIL
      }),

    phone: Joi.string()
      .min(10)
      .max(15)
      .label("Phone number")
      .messages({
        "string.min": COMMON_MESSAGES.STRING_MIN,
        "string.max": COMMON_MESSAGES.STRING_MAX
      }),

    address: Joi.string()
      .max(500)
      .label("Address")
      .messages({
        "string.max": COMMON_MESSAGES.STRING_MAX
      })
  }).min(1),

  id: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
      .label("Vendor ID")
      .messages({
        "number.base": COMMON_MESSAGES.NUMBER_BASE,
        "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
        "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
        "any.required": COMMON_MESSAGES.ANY_REQUIRED
      })
  })
};

module.exports = vendorSchema;
