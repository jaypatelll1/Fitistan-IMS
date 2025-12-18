const { PUBLIC_SCHEMA } = require("../libs/dbConstants");

/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA)
    .table("users", (table) => {
      table
        .integer("status_id")
        .references("status_id")
        .inTable(`${PUBLIC_SCHEMA}.status`)
        .onDelete("SET NULL");
    });
};

exports.down = function (knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA)
    .table("users", (table) => {
      table.dropColumn("status_id");
    });
};
