const express = require('express');
const VendorController = require('../controllers/vendor.controller.js');
const validateVendor = require('../validators/vendor.validator.js');

const router = express.Router();

// Create Vendor
router.post('/', validateVendor('create'), VendorController.createVendor);

// Get All Vendors
router.get('/', VendorController.getAllVendors);

// Get Vendor by ID
router.get('/v2/:id', validateVendor('id'), VendorController.getVendorById);

// Update Vendor
router.put('/:id', validateVendor('id'), validateVendor('update'), VendorController.updateVendor);

// Delete Vendor
router.delete('/:id', validateVendor('id'), VendorController.deleteVendor);

module.exports = router;
