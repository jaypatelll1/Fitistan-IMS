// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');


// Mount routes
router.use('/users', userRoutes);
router.use('/product', productRoutes);

module.exports = router;
