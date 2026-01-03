const { PUBLIC_SCHEMA } = require("../libs/dbConstants");


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('users',(table)=>{
        
        table.string('auth_id',500).notNullable
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('users',(table)=>{
        table.dropColumn('auth_id');
    })  
  
};
