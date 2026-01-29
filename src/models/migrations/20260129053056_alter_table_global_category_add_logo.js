const { PUBLIC_SCHEMA } = require("../libs/dbConstants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .withSchema(PUBLIC_SCHEMA)
    .alterTable("global_category", (table) => {
        table
      .string("logo_url", 512)
      .nullable()
      .comment("Public URL of category logo uploaded via presigned URL");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema(PUBLIC_SCHEMA).alterTable(
        "global_category", (table) => {
  table.dropColumn("logo_url");
        });
};
