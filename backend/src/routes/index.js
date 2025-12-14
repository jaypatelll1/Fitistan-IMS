// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./user.routes');
// const warehouseRoutes = require('./warehouse.routes');
// ... other routes will be added by team

// Mount routes
router.use('/users', userRoutes);
// router.use('/warehouses', warehouseRoutes);
// ... other routes will be mounted here

module.exports = router;
