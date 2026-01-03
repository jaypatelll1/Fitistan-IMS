const { PUBLIC_SCHEMA } = require("../libs/dbConstants");
const { addDefaultColumns } = require("../utilities/MigrationUtilities");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // 1. Create product_codes table
    await knex.schema.withSchema(PUBLIC_SCHEMA).createTable("product_codes", (table) => {
        table.increments("id").primary();
        table.string("code", 50).unique().notNullable(); // e.g., "NIKE-TSHIRT"
        table.string("name", 255); // e.g., "Nike Running T-Shirt"

        addDefaultColumns(table, knex);
    });

    // 2. Add product_code_id to products table
    const hasColumn = await knex.schema.withSchema(PUBLIC_SCHEMA).hasColumn("products", "product_code_id");
    if (!hasColumn) {
        await knex.schema.withSchema(PUBLIC_SCHEMA).alterTable("products", (table) => {
            table
                .integer("product_code_id")
                .references("id")
                .inTable("product_codes")
                .onUpdate("CASCADE")
                .onDelete("SET NULL");
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    const hasColumn = await knex.schema.hasColumn("products", "product_code_id");
    if (hasColumn) {
        await knex.schema.withSchema(PUBLIC_SCHEMA).alterTable("products", (table) => {
            table.dropColumn("product_code_id");
        });
    }
    await knex.schema.withSchema(PUBLIC_SCHEMA).dropTableIfExists("product_codes");
};
