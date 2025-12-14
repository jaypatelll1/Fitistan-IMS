// src/routes/variant.routes.js

const express = require('express');
const router = express.Router();
const VariantController = require('../controllers/variant.controller');
const { authenticateUser, isAdminOrManager } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateUser);

// Barcode scanning route (most used - put first)
router.get('/barcode/:barcode', VariantController.findByBarcode);

// Variant CRUD
router.post('/', isAdminOrManager, VariantController.create);
router.get('/', VariantController.getAll);
router.get('/:id', VariantController.getById);
router.put('/:id', isAdminOrManager, VariantController.update);
router.delete('/:id', isAdminOrManager, VariantController.delete);

// Barcode generation routes
router.post('/:id/generate-barcode', isAdminOrManager, VariantController.generateBarcode);
router.get('/:id/qr-code', VariantController.generateQRCode);
router.get('/:id/print-label', VariantController.generatePrintLabel);

module.exports = router;
