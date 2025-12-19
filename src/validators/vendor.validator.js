const Joi = require('joi');

// ============================
// Vendor Validation Schemas
// ============================
const vendorSchema = {
  // Create Vendor
  create: Joi.object({
    vendor_name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        'string.empty': 'Vendor name is required',
        'string.min': 'Vendor name must be at least 2 characters'
      }),


    email: Joi.string()
      .email()
      .max(255)
      .required()
      .messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required'
      }),

    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .max(50)
      .allow(null, '')
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),

    address: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .messages({
        'any.required': 'address is required',
        'string.empty': 'address is required',
        'string.min': 'address must be at least 10 characters'
      })
  }),

  // Update Vendor
  update: Joi.object({
    vendor_name: Joi.string().min(2).max(255),
    // contact_person: Joi.string().min(2).max(255),
    email: Joi.string().email().max(255),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .max(50)
      .allow(null, ''),
    address: Joi.string().max(1000).allow(null, '')
  }).min(1), // At least one field required for update

  // Vendor ID validation
  id: Joi.object({
    id: Joi.required().messages({
      'any.required': 'id is required',
      
    })
  })
};

// ============================
// Validation Middleware
// ============================
const validateVendor = (schema) => {
  return (req, res, next) => {
    const dataToValidate = schema === 'id' ? req.params : req.body;
    
    const { error, value } = vendorSchema[schema].validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true // removes any extra fields not in schema
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Pass validated data to controller
    req.validatedData = value;
    next();
  };
};

module.exports = validateVendor;
