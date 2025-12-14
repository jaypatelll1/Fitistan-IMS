exports.up = function (knex) {
  return knex.schema.createTable("inventory", (table) => {
    table
      .uuid("inventory_id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .uuid("variant_id")
      .notNullable()
      .references("variant_id")
      .inTable("product_variants")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table
      .uuid("room_id")
      .notNullable()
      .references("room_id")
      .inTable("rooms")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.integer("quantity_on_hand").defaultTo(0);
    table.integer("reserved_quantity").defaultTo(0);
    table.integer("reorder_level").defaultTo(10);
    table
      .enum("status", ["in_stock", "low_stock", "out_of_stock"])
      .defaultTo("in_stock");
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
