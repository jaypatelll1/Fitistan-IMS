const {PUBLIC_SCHEMA}= require("../libs/dbConstants");
const { addDefaultColumns } = require("../utilities/MigrationUtilities");

/**
 * 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA).createTable('global_category', function(table){
    table.increments("global_category_id").primary();
    table.string("category_name").notNullable().unique();
    addDefaultColumns(table,knex);

    
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema(PUBLIC_SCHEMA).dropTableIfExists('global_category');   
  
};
