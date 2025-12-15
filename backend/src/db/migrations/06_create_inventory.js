exports.up = function (knex) {
  return knex.schema.createTable("inventory", (table) => {
    table
      .increments("inventory_id")
      .primary()
      .notNullable()
      // .defaultTo(knex.raw("uuid_generate_v4()"));
      .integer("quantity_on_hand").defaultTo(0)
      .integer("reserved_quantity").defaultTo(0)
      .integer("reorder_level").defaultTo(10);

    table // add variant_id as foreign key from table product_variants
      .integer("variant_id")
      .notNullable()
      .references("variant_id")
      .inTable("product_variants")
      // .onDelete("CASCADE")
      // .onUpdate("CASCADE");

    table // add room_id as foreign key from table rooms
      .integer("room_id")
      .notNullable()
      .references("room_id")
      .inTable("rooms")
      // .onDelete("CASCADE")
      // .onUpdate("CASCADE");

    table // add status_id as foreign key from table status
      .integer("status_id")
      .references("status_id")
      .inTable("status")
      .unsigned()
      .notNullable();
      
      
    // table
    //   .enum("status", ["in_stock", "low_stock", "out_of_stock"])
    //   .defaultTo("in_stock");
    table.timestamp("last_updated").defaultTo(knex.fn.now());

    // Indexes
    table.index("variant_id");
    table.index("room_id");
    table.index("status");
    table.unique(["variant_id", "room_id"]); // One inventory record per variant per room
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("inventory");
};
