exports.up = function (knex) {
  return knex.schema.createTable("vendors", (table) => {
    table.incements("vendor_id").primary().notNullable(); 
    // .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("vendor_name", 100).notNullable();
    table.string("contact_person", 100);
    table.string("email", 100);
    table.string("phone", 20);

    table // add status_id as foreign key firom table status
    .integer("status_id")
    .references("status_id")
    .inTable("status")
    .unsigned()
    .notNullable();

    // table.enum("status", ["active", "inactive"]).defaultTo("active");
    table.timestamps(true, true);

    // Indexes
    table.index("status");
    table.index("vendor_name");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("vendors");
};
