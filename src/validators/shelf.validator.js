const JOi = require('joi');

const createShelfSchema = JOi.object({
  shelf_name: JOi.string().min(2).max(255).required().messages({
    'string.empty': 'Shelf name is required'}),
   warehouse_id: JOi.integer().required().messages({
      'integer.empty': 'Warehouse ID is required'
   }),
   room_id: JOi.integer().required().messages({
      'integer.empty': 'Room ID is required'
   })
})

// module.exports = JOi;``