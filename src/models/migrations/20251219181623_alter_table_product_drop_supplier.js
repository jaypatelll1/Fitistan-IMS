const { PUBLIC_SCHEMA } = require("../libs/dbConstants")




/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('products',(table)=>{

        table
             .dropColumn('supplier');
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('products',(table)=>{
        table.string('supplier',50).notNullable();
    })

  
};
