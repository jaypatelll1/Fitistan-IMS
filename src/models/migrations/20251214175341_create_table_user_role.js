
const {addDefaultColumns} = require("../utilities/MigrationUtilities")
const {PUBLIC_SCHEMA}= require("../libs/dbConstants")

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {

     return knex.schema.withSchema(PUBLIC_SCHEMA)
        .createTable('role', function (table) {
            table.increments('role_id').notNullable().primary()    // pk 
            table.string('name',255).notNullable();
            table.string('description',255).nullable();

            addDefaultColumns(table,knex);
        });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
