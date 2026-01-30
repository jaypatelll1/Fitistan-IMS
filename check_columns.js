const knex = require('knex')(require('./knexfile'));

async function checkColumns() {
    try {
        const columns = await knex('products').columnInfo();
        console.log(JSON.stringify(columns, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkColumns();
