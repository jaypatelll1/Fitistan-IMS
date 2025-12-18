const express = require("express");
const router = express.Router();

const VendorController = require("../controllers/vendor.controller");

const { authenticateUser } = require("../middleware/auth.middleware");

// All vendor routes require authentication
router.use(authenticateUser);

// Add vendor (ADMIN, MANAGER)
router.post(
  "/",
  VendorController.createVendor
);

// List vendors (ADMIN, MANAGER)
router.get(
  "/",
  VendorController.getAllVendors
);

// Get vendor by ID (ADMIN, MANAGER)
router.get(
  "/:id",
  VendorController.getVendorById
);

// Update vendor (ADMIN, MANAGER)
router.put(
  "/:id",
  VendorController.updateVendor
);

// Delete vendor (ADMIN only)
router.delete(
  "/:id",
  VendorController.deleteVendor
);

module.exports = router;