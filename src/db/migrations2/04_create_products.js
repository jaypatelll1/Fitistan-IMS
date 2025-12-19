// exports.up = function (knex) {
//   return knex.schema.createTable("products", (table) => {
//     table
//       .uuid("product_id")
//       .primary()
//       .defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("product_name", 100).notNullable();
//     table.string("category", 50).notNullable();
//     table
//       .uuid("vendor_id")
//       .references("vendor_id")
//       .inTable("vendors")
//       .onDelete("SET NULL")
//       .onUpdate("CASCADE");
//     table.enum("status", ["active", "inactive"]).defaultTo("active");
//     table.timestamps(true, true);

//     // Indexes
//     table.index("category");
//     table.index("status");
//     table.index("vendor_id");
//   });
// };

// exports.down = function (knex) {
//   return knex.schema.dropTableIfExists("products");
// };
