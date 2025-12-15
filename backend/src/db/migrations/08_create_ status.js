exports.up = function (knex) {
    return knex.schema.createTable("status", (table) => {

        table.increments("status_id").primary().notNullable();
        table.string("status_name", 50).notNullable().unique();
        // e.g., "active", "inactive", "maintenance", etc.
         table.timestamps(true, true);

        // Indexes
        table.index("status_name");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("status");
};