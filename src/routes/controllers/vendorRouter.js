const express = require("express");
const { appWrapper } = require("../routeWrapper");
const ACCESS_ROLES = require("../../businesslogic/accessmanagement/RoleConstants");
const VendorManager = require("../../businesslogic/managers/VendorManager");

const router = express.Router({ mergeParams: true });

router.get(
  "/get_all_vendors",
  appWrapper(async () => ({
    success: true,
    vendors: await VendorManager.getAllVendors()
  }), [ACCESS_ROLES.ALL])
);

router.post(
  "/create_vendor",
  appWrapper(async (req) => ({
    success: true,
    vendor: await VendorManager.createVendor(req.body),
    message: "Vendor created successfully"
  }), [ACCESS_ROLES.ALL])
);

router.get(
  "/get_vendor/:id",
  appWrapper(async (req) => {
    const vendor = await VendorManager.getVendorById(req.params);
    return vendor
      ? { success: true, vendor }
      : { success: false, message: "Vendor not found or already deleted" };
  }, [ACCESS_ROLES.ALL])
);

router.put(
  "/update_vendor/:id",
  appWrapper(async (req) => {
    const vendor = await VendorManager.updateVendor(req.params, req.body);
    return vendor
      ? { success: true, updated_vendor: vendor, message: "Vendor updated successfully" }
      : { success: false, message: "Vendor not found or nothing to update" };
  }, [ACCESS_ROLES.ALL])
);

router.delete(
  "/delete_vendor/:id",
  appWrapper(async (req) => {
    const deleted = await VendorManager.deleteVendor(req.params);
    return deleted
      ? { success: true, deleted_vendor: deleted, message: "Vendor deleted successfully" }
      : { success: false, message: "Vendor not found or already deleted" };
  }, [ACCESS_ROLES.ALL])
);

module.exports = router;