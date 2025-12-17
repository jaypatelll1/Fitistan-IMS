exports.up = function (knex) {
  return knex.schema.alterTable("products", (table) => {
    table.dropColumn("sku");
    table.dropColumn("barcode");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("products", (table) => {
    table.string("sku", 100).unique();
    table.string("barcode", 100).unique();
  });
};
