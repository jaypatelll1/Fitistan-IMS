const { PUBLIC_SCHEMA } = require("../libs/dbConstants");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Remove old string data 
  await knex.raw(`
    UPDATE ${PUBLIC_SCHEMA}.products
    SET product_image = NULL,
        barcode_image = NULL;
  `);

  // Change column types to JSONB
  await knex.schema
    .withSchema(PUBLIC_SCHEMA)
    .alterTable("products", (table) => {
      table.jsonb("product_image").nullable().alter();
      table.jsonb("barcode_image").nullable().alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  
  await knex.schema
    .withSchema(PUBLIC_SCHEMA)
    .alterTable("products", (table) => {
      table.string("product_image", 500).nullable().alter();
      table.string("barcode_image", 500).nullable().alter();
    });
};

