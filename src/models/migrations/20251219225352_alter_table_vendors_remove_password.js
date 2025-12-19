

const{PUBLIC_SCHEMA} = require("../libs/dbConstants")


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async  function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('vendors',(table)  => {

        table.dropColumn('password');
        
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async  function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('vendors',(table)=>{
        table.string('password',250).notNullable();
    })
  
};
