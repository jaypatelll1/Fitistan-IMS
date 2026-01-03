const { PUBLIC_SCHEMA } = require("../libs/dbConstants");


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('users',(table)=>{
        
        table.string('google_id',500).nullable();
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('users',(table)=>{
        table.dropColumn('google_id');
    })  
  
};
