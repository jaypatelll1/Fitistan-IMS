const joi = require("joi");
const COMMON_MESSAGES = require("../validators/validationConstants/commanMessages");


const createGlobalCategorySchema = joi.object({
  category_name: joi.string()
    .trim()
    .lowercase()
    .min(2)
    .max(50)
    .required()
    .label("Category Name")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.min": COMMON_MESSAGES.STRING_MIN,
      "string.max": COMMON_MESSAGES.STRING_MAX,
      "any.required": COMMON_MESSAGES.ANY_REQUIRED
    }),
    logo_url: joi.string()             
    .optional()                      
    .label("Category Logo URL")      
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.uri": "Logo URL must be a valid URI"
    })
})
const createCategorySchema = joi.object({
  category_name: joi.string()
    .trim()
    .lowercase()
    .min(2)
    .max(100)
    .required()
    .label("Category Name")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.min": COMMON_MESSAGES.STRING_MIN,
      "string.max": COMMON_MESSAGES.STRING_MAX,
      "any.required": COMMON_MESSAGES.ANY_REQUIRED
    }), 
  global_category_id: joi.number()
    .integer()
    .positive()
    .required()
    .label("Global Category ID")
    .messages({
      "number.base": COMMON_MESSAGES.NUMBER_BASE,
      "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
      "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
      "any.required": COMMON_MESSAGES.ANY_REQUIRED
    }),
    logo_url: joi.string()             
    .uri()
    .optional()
    .label("Category Logo URL")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.uri": "Logo URL must be a valid URI"
    })
  
    });
     const categoryIdSchema =joi.object ({
    category_id: joi.number()
    .integer()
    .positive()
    .required()
    .label("Category ID")
    .messages({
      "number.base": COMMON_MESSAGES.NUMBER_BASE,
      "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
      "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
      "any.required": COMMON_MESSAGES.ANY_REQUIRED
  })
});






module.exports = {
  createCategorySchema,
  createGlobalCategorySchema,
  categoryIdSchema
};