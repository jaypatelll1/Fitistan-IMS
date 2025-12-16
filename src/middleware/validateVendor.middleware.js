const Joi = require('joi');
const { update } = require('../config/database');

// Validation Schemas

const vendorSchema = {
    create: Joi.object({
    vendor_name: Joi.string().min(2).max(255).required()
        .message({
        'string.empty': 'Vendor name is required',
        'string.min': 'Vendor name must be at least 2 characters',
        }),
    email: Joi.string().email().max(255).required()
        .message({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required',
        }),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(50).allow(null, '')
        .messages({
          'string.pattern.base': 'Please provide a valid phone number',
        }),  
    password: Joi.string().min(8).required()
        .message({
        'string.password': 'Please enter the Password',
        'string.empty': 'password is required',
        }),
    address: Joi.string().min(10).max(1000).required()
        .message({
        'string.address': 'Please enter the Address',
        'string.empty': 'Address is required',
        }),
    }),

    update: Joi.object({
    vendor_name: Joi.string().min(2).max(255),
    email: Joi.string().email().max(255),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(50).allow(null, ''),
    address: Joi.string().max(1000).allow(null, ''),
    is_active: Joi.boolean(),
  }).min(1),

  id: Joi.object({
    id: Joi.number().integer().positive().required()
  })
};

// Middleware Function

const validateVendor = (schema) => {
  return (req,res,next) => {
    const dataToValidate = schema === 'id' ? req.params : req.body;

    const { error , value } = vendorSchema[schema].validate(dataToValidate,{
      abortEarly: false,
      stripUnknow: true
    });
    if(error){
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation Errors',
        errors
      });
    }
    req.validatedData = value;
    next();
  }
}

module.exports = validateVendor;

