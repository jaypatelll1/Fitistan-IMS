exports.up = function(knex) {
     return knex.schema.createTable("roles", (table) => {

        table
        .increments("role_id")
        .primary()
        .notNullable();

        table
        .string("rolw_name",50)
        .notNullable()
        .unique();

        table.timestamps(true, true);

        //Indexes
        table.index("role_name");
});
}

exports.down = function (knex){
    return knex.schema.dropTableIfExists("roles");
}