const Joi = require('joi');

const createShelfSchema = Joi.object({
  shelf_name: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Shelf name is required'}),
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
      'string.empty': 'Shelf name is required'}),  
       warehouse_id: Joi.number().integer().messages({
          'integer.empty': 'Warehouse ID is required'
       }),
         room_id: Joi.number().integer().messages({
          'integer.empty': 'Room ID is required'
       })
         ,   capacity: Joi.number().integer().optional().messages({
          'integer.empty': 'Capacity is required'
       })
})


module.exports = {
    createShelfSchema,
    updateShelfSchema
}


