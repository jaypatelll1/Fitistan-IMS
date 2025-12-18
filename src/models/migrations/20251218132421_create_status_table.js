const { PUBLIC_SCHEMA } = require("../libs/dbConstants");
const { addDefaultColumns } = require("../utilities/MigrationUtilities");

/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA)
    .createTable("status", (table) => {
      table.increments("status_id").primary();
      table.string("status_name", 50).notNullable().unique();

        addDefaultColumns(table, knex);
    });
};

exports.down = function (knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA)
    .dropTableIfExists("status");
};
