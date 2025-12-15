exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table 
      .increments("product_id") // .defaultTo(knex.raw("uuid_generate_v4()"));
      .primary()
      .notNullable()
      .string("product_name", 100).notNullable()
      .string("category", 50).notNullable();


    table // add vendor_id as foreign key from table vendors
      .integer("vendor_id")
      .references("vendor_id")
      .inTable("vendors")
      .unsigned()
      .notNullable();

      table // add status_id as foreign key from table status
      .integer("status_id")
      .references("status_id")
      .inTable("status")
      .unsigned()
      .notNullable();


    // .onDelete("SET NULL")
    // .onUpdate("CASCADE");
    // table.enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamps(true, true);

    // Indexes
    table.index("category");
    table.index("status");
    table.index("vendor_id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("products");
};
