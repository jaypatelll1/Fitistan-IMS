
const {PUBLIC_SCHEMA} = require("../../models/libs/dbConstants");    

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async  function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('status',(table)=>{
        table.dropColumn('status_name');
    })

  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('status',(table)=>{

        table.string('status_name').notNullable();
    })
  
};
