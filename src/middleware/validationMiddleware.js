module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
};


// const logger = require("../utils/logger");
// const ResponseHandler = require("../utils/responseHandler");

// /**
//  * Validation middleware factory
//  * @param {Object} schema - Joi validation schema
//  * @param {String} property - Request property to validate (body, params, query)
//  */
// const validate = (schema, property = "body") => {
//   return (req, res, next) => {
//     const { error, value } = schema.validate(req[property], {
//       abortEarly: false, // Show all errors
//       stripUnknown: true, // Remove unknown fields
//     });

//     if (error) {
//       const errors = error.details.map((detail) => ({
//         field: detail.path.join("."),
//         message: detail.message.replace(/"/g, ""),
//       }));

//       logger.warn(`Validation failed for ${req.method} ${req.path}:`, errors);
//       return ResponseHandler.badRequest(res, "Validation failed", errors);
//     }

//     // Replace request data with validated data
//     req[property] = value;
//     next();
//   };
// };

// module.exports = validate;
