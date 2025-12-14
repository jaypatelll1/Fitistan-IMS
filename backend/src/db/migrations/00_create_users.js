// src/db/migrations/20241214000000_create_users.js
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.uuid("user_id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("clerk_user_id", 100).notNullable().unique(); // From Clerk
    table.string("email", 100).notNullable().unique();
    table.string("first_name", 50);
    table.string("last_name", 50);
    table.string("phone", 20);
    table
      .enum("role", ["admin", "manager", "staff", "viewer"])
      .defaultTo("staff");
    table
      .enum("status", ["active", "inactive", "suspended"])
      .defaultTo("active");
    table.timestamp("last_login");
    table.timestamps(true, true);

    // Indexes
    table.index("clerk_user_id");
    table.index("email");
    table.index("role");
    table.index("status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
