const express = require("express");
const router = express.Router();
const VariantController = require("../controllers/variant.controller");

// CREATE VARIANT
router.post("/", VariantController.createVariant);

// GET ALL VARIANTS
router.get("/", VariantController.getAllVariants);

// GET VARIANT BY ID
router.get("/:id", VariantController.getVariantById);

// GET VARIANT BY BARCODE
router.get("/barcode/:barcode", VariantController.findByBarcode);

// UPDATE VARIANT
router.put("/:id", VariantController.updateVariant);

// DELETE VARIANT
router.delete("/:id", VariantController.deleteVariant);

// GENERATE BARCODE
router.post("/:id/generate-barcode", VariantController.generateBarcode);

module.exports = router;
