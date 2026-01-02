// src/validators/user.validator.js
const Joi = require("joi");
const COMMON_MESSAGES = require("../validators/validationConstants/commanMessages");

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

const profileUpdateSchema = Joi.object({  
  email: Joi.string()
    .email()
    .required()
    .label("Email")
    .messages({
      "string.email": COMMON_MESSAGES.STRING_EMAIL,
      
    })
    .optional(),

 

  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label("Name")
    .messages({
      "string.base": COMMON_MESSAGES.STRING_BASE,
      "string.min": COMMON_MESSAGES.STRING_MIN,
      "string.max": COMMON_MESSAGES.STRING_MAX,
    
    })
    .optional(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .label("Phone number")
    .messages({
      "string.pattern.base": "Phone number must be 10 digits"
    })
    .optional(),

  gender: Joi.string()
    .valid("male", "female", "other")
    .label("Gender")
    .messages({
      "any.only": "{#label} must be male, female or other"
    })
    .optional(),

  address: Joi.string()
  .max(225)
  .label("Address")
  .messages({
    "string.base": COMMON_MESSAGES.STRING_BASE,
    "string.max": COMMON_MESSAGES.STRING_MAX
  })
  .optional(),

  location: Joi.string()
  .max(100)
  .label("Location")
  .messages({
    "string.base": COMMON_MESSAGES.STRING_BASE,
    "string.max": COMMON_MESSAGES.STRING_MAX
  })
  .optional(),

  date_of_birth: Joi.date()
    .less('now')
    .messages({
      "date.less": "Date of birth must be in the past"
    })
    .optional(),

 postal_code: Joi.string()
  .pattern(/^[1-9][0-9]{5}$/)
  .label("Postal Code")
  .messages({
    "string.base": COMMON_MESSAGES.STRING_BASE,
    "string.max": COMMON_MESSAGES.STRING_MAX,
    "string.min": COMMON_MESSAGES.STRING_MIN,
  }) .optional()


  });

  const idSchema = Joi.number().integer().positive().required()
 

    
 

module.exports = {
  updateRoleSchema,
  updateStatusSchema,
  profileUpdateSchema,
  idSchema
};
