/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return await knex.schema.withSchema()
  .alterTable('vendors',function(table){
      table.dropIndex('email');
      table.dropIndex('is_active');
      table.dropIndex(['is_active', 'vendor_name']);

      table.dropColumn('password');
      table.dropColumn('is_active');
  })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.withSchema(PUBLIC_SCHEMA)
    .alterTable('vendors', function(table) {
      table.string('password', 255).nullable();
      table.boolean('is_active').defaultTo(true).notNullable();
      
      table.index('is_active');
      table.index(['is_active', 'vendor_name']);
    });
};
