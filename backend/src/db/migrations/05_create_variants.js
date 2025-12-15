exports.up = function (knex) {
  return knex.schema.createTable("product_variants", (table) => {
    table
      .increments("variant_id").notNullable()
      .primary()
      // .defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("sku", 50).notNullable().unique();
      table.string("variant_name", 100).notNullable();
      table.jsonb("attributes");
      table.string("barcode", 100).unique();

    table // add product_id as foreign key from table products
      .increments("product_id")
      .notNullable()
      .references("product_id")
      .inTable("products")
      .unsigned();

    table // add status_id as foreign key from table status
      .integer("status_id")
      .references("status_id")
      .inTable("status")
      .notNullable()
      .unsigned();


      // .onDelete("CASCADE")
      // .onUpdate("CASCADE");
    // table.enum("status", ["active", "inactive"]).defaultTo("active");
    // we will use seperate table for roles and status to make it more clear 
    
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
