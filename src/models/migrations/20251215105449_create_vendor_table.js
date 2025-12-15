/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const {addDefaultColumns} = require("../utilities/MigrationUtilities")
const {PUBLIC_SCHEMA}= require("../libs/dbConstants")


exports.up = function(knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA)
    .createTable('vendors',function(table){
        table.increments('vendor_id').notNullable().primary()    // pk 
        table.string('vendor_name',255).notNullable();
        table.string('email',255).unique().notNullable();
        table.string('phone',50).notNullable();
        table.string('password',255).nullable();
        table.text('address').nullable();
        table.boolean('is_active').defaultTo(true).notNullable();

        addDefaultColumns(table,knex);

        // table.index('email');
        table.index('is_active');
        table.index(['is_active','vendor_name']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA).dropTableIfExists('vendors');
};
