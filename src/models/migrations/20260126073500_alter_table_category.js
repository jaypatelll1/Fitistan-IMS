const { PUBLIC_SCHEMA } = require("../libs/dbConstants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.withSchema(PUBLIC_SCHEMA).alterTable("category", function (table) {
      table
        .integer("global_category_id")
        .unsigned()
        .nullable(); // allow existing rows
    });

  await knex.schema
    .withSchema(PUBLIC_SCHEMA)
    .table("category", function (table) {
      table
        .foreign("global_category_id")
        .references("global_category_id")
        .inTable(`${PUBLIC_SCHEMA}.global_category`)
        .onDelete("SET NULL");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema
    .withSchema(PUBLIC_SCHEMA)
    .alterTable("category", function (table) {
      table.dropForeign(["global_category_id"]);
      table.dropColumn("global_category_id");
    });
};

