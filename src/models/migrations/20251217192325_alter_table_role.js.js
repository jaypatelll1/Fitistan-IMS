const { PUBLIC_SCHEMA } = require("../libs/dbConstants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema(PUBLIC_SCHEMA)
    .alterTable("role", (table) => {
      table.renameColumn("name", "role_name");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema(PUBLIC_SCHEMA)
    .alterTable("role", (table) => {
      table.renameColumn("role_name", "name");
    });
};
