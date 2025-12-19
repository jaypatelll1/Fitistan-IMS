require('dotenv').config();
const express = require('express');
const router = express.Router();
const app = require('./src/app');
const logger = require('./src/utils/logger');

const userRoutes = require('./src/routes/user.routes');
const productRoutes = require('./src/routes/product.routes');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔗 Test DB: http://localhost:${PORT}/test-db`);
});

router.use('/users', userRoutes);
router.use('/product', productRoutes);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, closing server...');
  server.close(() => process.exit(0));
});
