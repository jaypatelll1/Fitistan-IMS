
const{PUBLIC_SCHEMA} = require("../libs/dbConstants")

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('products',(table)=>{
        
        table.string('sku',50).unique().notNullable();
        table.string('barcode',250).unique().notNullable();
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('products',(table)=>{

        table.dropColumn('SKU').dropColumn('barcode');

    })
  
};
