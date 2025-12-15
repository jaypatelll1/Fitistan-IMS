exports.up = function (knex) {
  return knex.schema.createTable("rooms", (table) => {
    table.increments("room_id").primary().notNullable() // .defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .integer("warehouse_id")
      .notNullable()
      .references("warehouse_id")
      .inTable("warehouses")
      // .onDelete("CASCADE")
      // .onUpdate("CASCADE");
    table.string("room_number", 50).notNullable();
    table.string("room_name", 100).notNullable();
    table.integer("capacity").notNullable();
    table.integer("current_utilization").defaultTo(0);

    table // add status_id as foreign key from table status
    .integer("status_id")
    .references("status_id")
    .inTable("status")
    .unsigned()
    .notNullable();
    
      // .enum("status", ["active", "maintenance", "closed"])
      // .defaultTo("active");
    table.timestamps(true, true);
    // Indexes
    table.index("warehouse_id");
    table.index("status");
    table.unique(["warehouse_id", "room_number"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("rooms");
};
