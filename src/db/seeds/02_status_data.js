const { PUBLIC_SCHEMA } = require("../../models/libs/dbConstants");

exports.seed = async function (knex) {
  // Clear existing data
  await knex.withSchema(PUBLIC_SCHEMA).table("status").del();

  // Insert default statuses
  await knex.withSchema(PUBLIC_SCHEMA).table("status").insert([
    { status_name: "active" },
    { status_name: "inactive" },
    { status_name: "suspended" }
  ]);
};
