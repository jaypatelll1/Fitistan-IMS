const Joi = require("joi");
const COMMON_MESSAGES = require("../validators/validationConstants/commanMessages");

const productIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .label("Product ID")
    .messages({
      "number.base": COMMON_MESSAGES.NUMBER_BASE,
      "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
      "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
      "any.required": COMMON_MESSAGES.ANY_REQUIRED
    })
});

const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .label("Product name")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.empty": COMMON_MESSAGES.STRING_EMPTY,
      "string.min": COMMON_MESSAGES.STRING_MIN,
      "string.max": COMMON_MESSAGES.STRING_MAX,
      "any.required": COMMON_MESSAGES.ANY_REQUIRED
    }),

  sku: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .label("SKU")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.empty": COMMON_MESSAGES.STRING_EMPTY,
      "string.min": COMMON_MESSAGES.STRING_MIN,
      "string.max": COMMON_MESSAGES.STRING_MAX,
      "any.required": COMMON_MESSAGES.ANY_REQUIRED
    }),

  // price: Joi.number()
  //   .positive()
  //   .required()
  //   .label("Price")
  //   .messages({
  //     "number.base": COMMON_MESSAGES.NUMBER_BASE,
  //     "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
  //     "any.required": COMMON_MESSAGES.ANY_REQUIRED
  //   }),

  // quantity: Joi.number()
  //   .integer()
  //   .min(0)
  //   .required()
  //   .label("Quantity")
  //   .messages({
  //     "number.base": COMMON_MESSAGES.NUMBER_BASE,
  //     "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
  //     "number.min": COMMON_MESSAGES.NUMBER_MIN,
  //     "any.required": COMMON_MESSAGES.ANY_REQUIRED
  //   }),

  description: Joi.string()
    .allow("", null)
    .label("Description")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE
    }),

  barcode: Joi.string()
    .optional()
    .label("Barcode")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE
    }),
    category: Joi.string()
    .trim()
    .required()
    .label("Category")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.empty": COMMON_MESSAGES.STRING_EMPTY,
      "string.min": COMMON_MESSAGES.STRING_MIN,
      "any.required": COMMON_MESSAGES.ANY_REQUIRED
    }),
    
  product_image: Joi.string()
    .allow("", null)
    .label("Product Image")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE
    })
  
});

const updateProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .label("Product name")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.empty": COMMON_MESSAGES.STRING_EMPTY,
      "string.min": COMMON_MESSAGES.STRING_MIN,
      "string.max": COMMON_MESSAGES.STRING_MAX
    }),

  sku: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .label("SKU")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.empty": COMMON_MESSAGES.STRING_EMPTY,
      "string.min": COMMON_MESSAGES.STRING_MIN,
      "string.max": COMMON_MESSAGES.STRING_MAX
    }),

  // price: Joi.number()
  //   .positive()
  //   .label("Price")
  //   .messages({
  //     "number.base": COMMON_MESSAGES.NUMBER_BASE,
  //     "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE
  //   }),

  // quantity: Joi.number()
  //   .integer()
  //   .min(0)
  //   .label("Quantity")
  //   .messages({
  //     "number.base": COMMON_MESSAGES.NUMBER_BASE,
  //     "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
  //     "number.min": COMMON_MESSAGES.NUMBER_MIN
  //   }),

  description: Joi.string()
    .allow("", null)
    .label("Description")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE
    }),

  barcode: Joi.string()
    .optional()
    .label("Barcode")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE
    }),

  product_image: Joi.string()
    .allow("", null)
    .label("Product Image")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE
    })  
}).min(1);
 

module.exports = {
  productIdSchema,
  createProductSchema,
  updateProductSchema
};
