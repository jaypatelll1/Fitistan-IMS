/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
exports.up = function (knex) {
  return knex.schema.alterTable("items", function (table) {
    table
      .string("status")
      .notNullable()
      .defaultTo("available");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("items", function (table) {
    table.dropColumn("status");
  });
};
