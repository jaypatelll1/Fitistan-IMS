const { PUBLIC_SCHEMA } = require("../libs/dbConstants");


exports.up = function(knex) {
    return knex.schema.withSchema(PUBLIC_SCHEMA).alterTable(
        "products", (table) => {
            table.string("category", 100).nullable();
        }
    )
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema(PUBLIC_SCHEMA).alterTable(
        "products", (table) => {
            table.dropColumn("category");
        }
    )
  
};
