const { PUBLIC_SCHEMA } = require("../libs/dbConstants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
{
  await knex.schema.withSchema(PUBLIC_SCHEMA).alterTable("products", (table) => {
    table
      .integer("category_id")
      .unsigned()
      .nullable()
      .references("category_id")
      .inTable("category")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });
};
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema(PUBLIC_SCHEMA).alterTable("products", (table) => {
        table.dropColumn("category_id");
    }
    )
  
};
