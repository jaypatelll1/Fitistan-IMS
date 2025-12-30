const{PUBLIC_SCHEMA} = require("../libs/dbConstants")

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA).alterTable('products', (table) => {
      table.string('product_image', 500).nullable();
      table.string('barcode_image', 500).nullable();
})};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA).alterTable('products', (table) => {
      table.dropColumn('product_image');
      table.dropColumn('barcode_image');
    });
};
