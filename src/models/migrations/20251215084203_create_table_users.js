const { addDefaultColumns } = require("../utilities/MigrationUtilities")



/**
 * 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.withSchema('public')
        .createTable('users', function (table) {
            table.increments('user_id').notNullable().primary();    // pk 
            table.string("name", 50);
            table.string("gender", 10);
            table.string("phone", 20);
            table.string("profile_picture_url", 255);
            table.string('email', 255).notNullable().unique();
            table.string('password_hash', 255).notNullable();
            table.integer('role_id').references('role_id').inTable('public.role').onDelete('SET NULL');
           
            addDefaultColumns(table, knex);

        })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.withSchema('public')
        .dropTableIfExists('users');

};


