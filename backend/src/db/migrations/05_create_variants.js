exports.up = function (knex) {
  return knex.schema.createTable("product_variants", (table) => {
    table
      .uuid("variant_id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .uuid("product_id")
      .notNullable()
      .references("product_id")
      .inTable("products")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("sku", 50).notNullable().unique();
    table.string("variant_name", 100).notNullable();
    table.jsonb("attributes");
    table.string("barcode", 100).unique();
    table.enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamps(true, true);

    // Indexes
    table.index("product_id");
    table.index("sku");
    table.index("barcode");
    table.index("status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("product_variants");
};
