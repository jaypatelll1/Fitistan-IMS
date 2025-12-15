exports.up = function (knex) {
  return knex.schema.createTable("stock_movements", (table) => {
    table
      .increments("movement_id")
      .primary();
      notNullable();
      // .defaultTo(knex.raw("uuid_generate_v4()"));

    table // add variant_id as foreign key from table product_variants
      .integer("variant_id")
      .notNullable()
      .references("variant_id")
      .inTable("product_variants");
      // .onDelete("CASCADE")
      // .onUpdate("CASCADE");

    table // add from_room_id as foreign key from table rooms
      .integer("from_room_id")
      .references("room_id")
      .inTable("rooms");
      // .onDelete("SET NULL")
      // .onUpdate("CASCADE");

    table // add to_room_id as foreign key from table rooms
      .integer("to_room_id")
      .references("room_id")
      .inTable("rooms");
      // .onDelete("SET NULL")
      // .onUpdate("CASCADE");

    table // add status_stockmove_id as foreign key from table stock_movement_status
      .integer("status_stockmove_id")
      .references("status_stockmove_id")
      .inTable("stock_movement_status")
      .unsigned()
      .notNullable();

    // table
    //   .enum("movement_type", ["inbound", "outbound", "transfer", "adjustment"])
    //   .notNullable();
    // table.integer("quantity").notNullable();
    // table.enum("reason", [
    //   "new_stock",
    //   "sale",
    //   "return",
    //   "damage",
    //   "transfer",
    //   "correction",
   ;

    // UPDATED: Reference users table instead of just storing clerk_user_id
    table
      .increments("performed_by")
      .notNullable()
      .references("user_id")
      .inTable("users")
      // .onDelete("RESTRICT")
      // .onUpdate("CASCADE");

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
