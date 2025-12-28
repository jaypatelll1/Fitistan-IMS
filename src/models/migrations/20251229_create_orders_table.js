const { addDefaultColumns } = require("../utilities/MigrationUtilities");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.withSchema('public').createTable('orders', (table) => {

        table.increments('order_id').notNullable().primary();
        table.integer('product_id').unsigned().notNullable()
            .references('product_id').inTable('products').onDelete('CASCADE');
        table.integer('shelf_id').unsigned().notNullable()
            .references('shelf_id').inTable('shelf').onDelete('CASCADE');
        table.integer('quantity').notNullable().defaultTo(1);
        table.string('status', 50).notNullable().defaultTo('processing');

        addDefaultColumns(table, knex);

        // Indexes
        table.index('product_id');
        table.index('shelf_id');
        table.index('status');
    
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.withSchema('public').dropTableIfExists('orders');
};
