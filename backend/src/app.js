const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { clerkMiddleware } = require('@clerk/express');
const logger = require('./utils/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Clerk middleware (must be first)
app.use(clerkMiddleware());

// Security
app.use(helmet());

// CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// HTTP logging
app.use(
  morgan('dev', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const db = require('./config/database');
    const result = await db.raw('SELECT NOW() as time');
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes will be added here
// app.use('/api/v1', require('./routes'));

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
