const {PUBLIC_SCHEMA} = require("../libs/dbConstants")
const { addDefaultColumns } = require("../utilities/MigrationUtilities");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA).createTable('variants', (table) => {
        
        table.increments('variant_id').notNullable().primary();
        table.string('name', 255).notNullable();
        table.integer('product_id').unsigned().notNullable()
         .references('product_id').inTable(`${PUBLIC_SCHEMA} products`);
        table.string('sku', 100).notNullable().unique();
        table.string('barcode', 100).unique();
        table.integer('stock_quantity').notNullable().defaultTo(0);
        
        
            
        
        addDefaultColumns(table, knex);

        // Indexes
        table.index('name');
        table.index('product_id');
  
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA).dropTableIfExists('variants');
};
