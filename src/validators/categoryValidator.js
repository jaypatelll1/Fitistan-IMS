const joi = require("joi");
const COMMON_MESSAGES = require("../validators/validationConstants/commanMessages");


const createCategorySchema = joi.object({
  category_name: joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .label("Category Name")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.min": COMMON_MESSAGES.STRING_MIN,
      "string.max": COMMON_MESSAGES.STRING_MAX,
      "any.required": COMMON_MESSAGES.ANY_REQUIRED
    })
})


module.exports = {
  createCategorySchema
};