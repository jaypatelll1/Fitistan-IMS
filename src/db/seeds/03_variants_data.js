const { PUBLIC_SCHEMA } = require("../../models/libs/dbConstants");

exports.seed = async function (knex) {
  // Clear existing data
  await knex.withSchema(PUBLIC_SCHEMA).table("variants").del();

  // Insert default variants
  await knex.withSchema(PUBLIC_SCHEMA).table("variants").insert([
    {
      variant_id: 1,
      name: "Small",
       sku: "PROD1-S",
      product_id: 1
      
    },
    {
      variant_id: 2,
      name: "Medium",
       sku: "PROD1-M",
      product_id: 1
    },
    {
      variant_id:3,
      name: "Large",
       sku: "PROD1-L",
      product_id: 1
    }
  ]);
};
