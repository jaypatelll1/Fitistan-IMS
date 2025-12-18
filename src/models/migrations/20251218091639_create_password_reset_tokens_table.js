const {PUBLIC_SCHEMA} = require("../libs/dbConstants");
const { addDefaultColumns } = require("../utilities/MigrationUtilities");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.withSchema(PUBLIC_SCHEMA).createTable("password_reset", (table) => {
        table.increments("token_id").primary();
        table.string("reset_password_token");
        table.timestamp("reset_password_expires");
        table.integer("user_id").references("user_id").inTable("users");
        addDefaultColumns(table, knex);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema('public').dropTableIfExists("password_reset_tokens");
  
};
