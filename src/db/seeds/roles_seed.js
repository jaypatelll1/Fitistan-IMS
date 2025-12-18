/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex("role").del();
  await knex("role").insert([
    { role_id: 1, role_name: "admin" },
    { role_id: 2, role_name: "manager" },
    { role_id: 3, role_name: "staff" },
    { role_id: 4, role_name: "user" }
  ]);
};

