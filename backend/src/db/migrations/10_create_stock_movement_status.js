exports.up = function (knex) {
  return knex.schema.createTable("stock_movement_status", (table) => {

    table
      .increments("status_stockmove_id")
      .primary()
      .notNullable();

    table
    .string("status_stockmove_type", 50).notNullable().unique();
    // e.g., "pending", "completed", "canceled", etc.

    table
    .string("status_stockmove_reason", 255).notNullable().unique();
    // e.g., "damaged", "expired", "customer_return", etc.

    table.timestamps(true, true);

  });
};