const Joi = require('joi');
const ValidationError = require('../errorhandlers/ValidationError');

const createShelfSchema = Joi.object({
  shelf_name: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Shelf name is required',
   
  }),
   warehouse_id: Joi.number().integer().required().messages({
      'integer.empty': 'Warehouse ID is required'
   }),
   room_id: Joi.number().integer().required().messages({
      'integer.empty': 'Room ID is required'
   }),
   capacity: Joi.number().integer().optional().messages({
      'integer.empty': 'Capacity is required'
   })
})

const updateShelfSchema = Joi.object({
    shelf_name: Joi.string().min(2).max(255).messages({
      'string.empty': 'Shelf name is required'
     }),  
       warehouse_id: Joi.number().integer().messages({
          'integer.empty': 'Warehouse ID is required'
         
       }),
         room_id: Joi.number().integer().messages({
          'integer.empty': 'Room ID is required'
          
       })
         ,   capacity: Joi.number().integer().optional().messages({
          'integer.empty': 'Capacity is required'
          
       })
});


const validateShelf = (type) => {
  return (req, res, next) => {
    let schema;
    let data;

    if (type === "create") {
      schema = createShelfSchema;
      data = req.body;
    }

    if (type === "update") {
      schema = updateShelfSchema;
      data = req.body;
    }

    if (type === "id") {
      schema = Joi.object({
        id: Joi.number().integer().required()
      });
      data = req.params;
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const vError = new ValidationError(error);
      return res.status(vError.status).json(vError.response);
    }

    if (!req.validatedData) req.validatedData = {};

    if (type === "create") req.validatedData.createBody = value;
    if (type === "update") req.validatedData.updateBody = value;
    if (type === "id") req.validatedData.id = value.id;

    next();
  };
};



module.exports = {
    createShelfSchema,
    updateShelfSchema,
      validateShelf
}


