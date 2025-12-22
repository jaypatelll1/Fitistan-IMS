const express = require("express");
const VendorController = require("./controllers/vendorRouter");
const validateVendor = require("../validators/vendor.validator");
const { ACCESS_ROLES } = require("../businesslogic/accessmanagement/roleConstants");
const { appWrapper } = require("./routeWrapper");

const router = express.Router();

// CREATE
router.post(
  "/",
  validateVendor("create"),
  appWrapper(async (req, res) => {
    const vendor = await VendorController.create(req);
    res.status(201).json(vendor);
  }, [ACCESS_ROLES.ADMIN])
);

// GET ALL
router.get(
  "/",
  appWrapper(async (req, res) => {
    const vendors = await VendorController.list(req);
    res.json(vendors);
  }, [ACCESS_ROLES.ADMIN])
);

// GET BY ID
router.get(
  "/:id",
  validateVendor("id"),
  appWrapper(async (req, res) => {
    const vendor = await VendorController.get(req);
    res.json(vendor);
  }, [ACCESS_ROLES.ADMIN])
);

// UPDATE ✅
router.put(
  "/:id",
  validateVendor("id"),
  validateVendor("update"),
  appWrapper(async (req, res) => {
    const result = await VendorController.update(req);
    res.json(result);
  }, [ACCESS_ROLES.ADMIN])
);

// DELETE
router.delete(
  "/:id",
  validateVendor("id"),
  appWrapper(async (req, res) => {
    await VendorController.remove(req);
    res.json({
      success: true,
      message: "Vendor deleted successfully"
    });
  }, [ACCESS_ROLES.ADMIN])
);

module.exports = router;
