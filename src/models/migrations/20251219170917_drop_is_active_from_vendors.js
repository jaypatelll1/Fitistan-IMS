exports.up = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropForeign('status_id');
  });

  await knex.schema.dropTableIfExists('status');
};

exports.down = async function (knex) {
  await knex.schema.createTable('status', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
  });

  await knex.schema.alterTable('users', (table) => {
    table
      .integer('status_id')
      .unsigned()
      .references('id')
      .inTable('status');
  });
};

const {PUBLIC_SCHEMA} = require("../libs/dbConstants")

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await  knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('vendors',(table) => {
        table.dropColumn('is_active');
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('vendors', (table)=> {
        table.boolean('is_active').defaultTo(true);
    })


  
};
