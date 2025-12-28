const{PUBLIC_SCHEMA} = require("../libs/dbConstants")



exports.up = async function(knex) {
  return await knex.schema.withSchema(PUBLIC_SCHEMA).alterTable('users',(table)=>{
       table.string('address',255).notNullable();
       table.string('location',100).notNullable();
       table.date('date_of_birth').notNullable();
       table.integer('postal_code').notNullable();
  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.withSchema(PUBLIC_SCHEMA).alterTable('users',(table)=>{
        table.dropColumn('address');
        table.dropColumn('location');
        table.dropColumn('date_of_birth');
        table.dropColumn('postal_code');
    });
};
