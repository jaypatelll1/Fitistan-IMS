const { PUBLIC_SCHEMA } = require("../libs/dbConstants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema(PUBLIC_SCHEMA)
    .alterTable("products", (table) => {
      table.decimal("mrp", 10, 2).notNullable().defaultTo(0);
      table.decimal("discounted_price", 10, 2).notNullable().defaultTo(0);
      table.decimal("gst_percentage", 5, 2).notNullable().defaultTo(0);
      table.decimal("cost_to_consumer", 10, 2).notNullable().defaultTo(0);
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA).alterTable(
        "products", (table) => {
            table.dropColumn("mrp");
            table.dropColumn("discounted_price");
            table.dropColumn("gst_percentage");
            table.dropColumn("cost_to_consumer");
        }
    )
};
