// require("dotenv").config();

// module.exports = {
//   development: {
//     client: "pg",
//     connection: {
//       connectionString: process.env.DATABASE_URL,
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     },
//     pool: {
//       min: 0,
//       max: 1,
//       idleTimeoutMillis: 30000,
//       acquireTimeoutMillis: 30000,
//     },
//     migrations: {
//       directory: "./src/models/migrations",
//       tableName: "knex_migrations",
//     },
//     seeds: {
//       directory: "./src/db/seeds",
//     },
//   },

//   production: {
//     client: "pg",
//     connection: {
//       connectionString: process.env.DATABASE_URL,
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     },
//     pool: {
//       min: 0,
//       max: 2,
//     },
//     migrations: {
//       directory: "./src/models/migrations",
//       tableName: "knex_migrations",
//     },
//   },
// };
require("dotenv").config();

const baseConfig = {
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    min: 0,
    max: 2,
  },
  migrations: {
    directory: "./src/models/migrations",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./src/db/seeds",
  },
};

module.exports = {
  development: baseConfig,
  production: baseConfig,
};
