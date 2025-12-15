exports.up = function (knex) {
  return knex.schema.createTable("warehouses", (table) => {
    table
      .increments("warehouse_id")
      .primary()
      .notNullable();
      // .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("warehouse_name", 100).notNullable();
    table.string("location", 100).notNullable();
    table.text("address").notNullable();
    table.integer("total_capacity").notNullable();

    table // add status_id as foreign key from table status
    .integer("status_id")
    .references("status_id")
    .inTable("status")
    .unsigned()
    .notNullable();

    // .enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamps(true, true);
    // Indexes
    table.index("status");
    table.index("location");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("warehouses");
};
