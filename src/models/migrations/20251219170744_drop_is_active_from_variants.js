/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

const {PUBLIC_SCHEMA} = require("../libs/dbConstants")

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await  knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('variants',(table) => {
        table.dropColumn('is_active');
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('variants', (table)=> {
        table.boolean('is_active').defaultTo(true);
    })


  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
