exports.up = async function (knex) {
  await knex.schema.withSchema('public').alterTable('users', (table) => {
    table.dropForeign('status_id');
  });

  await knex.schema.withSchema('public').dropTableIfExists('status');
};

exports.down = async function (knex) {
  await knex.schema.withSchema('public').createTable('status', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
  });

  await knex.schema.withSchema('public').alterTable('users', (table) => {
    table
      .integer('status_id')
      .unsigned()
      .references('id')
      .inTable('status');
  });
};
