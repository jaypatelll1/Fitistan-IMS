const knex = require('knex');
const knexConfig = require('../../knexfile');
const logger = require('../utils/logger');

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

const db = knex(config);

// Test connection and setup
(async () => {
  try {
    await db.raw('SELECT NOW() as current_time');
    logger.info('✅ Database connected successfully');

    // Enable UUID extension
    await db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    logger.info('✅ UUID extension enabled');
  } catch (err) {
    logger.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
})();

module.exports = db;
