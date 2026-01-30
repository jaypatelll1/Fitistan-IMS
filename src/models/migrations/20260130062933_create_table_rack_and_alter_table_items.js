/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { addDefaultColumns } = require("../utilities/MigrationUtilities");
const { PUBLIC_SCHEMA } = require("../libs/dbConstants");

exports.up = function (knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA)

    // Create racks table
    .createTable("racks", function (table) {
      table.increments("rack_id").notNullable().primary(); // pk
      table.string("rack_name", 255).notNullable();

      table
        .integer("warehouse_id")
        .unsigned()
        .references("warehouse_id")
        .inTable(`${PUBLIC_SCHEMA}.warehouses`)
        .nullable();

      table
        .integer("room_id")
        .unsigned()
        .references("room_id")
        .inTable(`${PUBLIC_SCHEMA}.rooms`)
        .nullable();

      table.integer("capacity").nullable();

      // Default columns (is_deleted, created_at, updated_at, created_by, last_modified_by)
      addDefaultColumns(table, knex);

      // Indexes
      table.index("warehouse_id");
      table.index("room_id");
      table.index("is_deleted");
    })

    // Add rack_id column to items table
    .table("items", function (table) {
      table
        .integer("rack_id")
        .unsigned()
        .references("rack_id")
        .inTable(`${PUBLIC_SCHEMA}.racks`)
        .nullable();

      table.index("rack_id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA)
    .table("items", function (table) {
      table.dropColumn("rack_id");
    })
    .dropTableIfExists("racks");
};
