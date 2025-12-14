exports.up = function (knex) {
  return knex.schema.createTable("stock_movements", (table) => {
    table
      .uuid("movement_id")
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
      .uuid("from_room_id")
      .references("room_id")
      .inTable("rooms")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table
      .uuid("to_room_id")
      .references("room_id")
      .inTable("rooms")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table
      .enum("movement_type", ["inbound", "outbound", "transfer", "adjustment"])
      .notNullable();
    table.integer("quantity").notNullable();
    table.enum("reason", [
      "new_stock",
      "sale",
      "return",
      "damage",
      "transfer",
      "correction",
    ]);

    // UPDATED: Reference users table instead of just storing clerk_user_id
    table
      .uuid("performed_by")
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table.text("notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("variant_id");
    table.index("from_room_id");
    table.index("to_room_id");
    table.index("movement_type");
    table.index("created_at");
    table.index("performed_by");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("stock_movements");
};
