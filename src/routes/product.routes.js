const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller");
const { appWrapper } = require("../routes/routeWrapper");

// LIST ALL PRODUCTS
router.get(
  "/all",
  appWrapper(ProductController.list)
);

// GET PRODUCT BY ID
router.get(
  "/:id",
  appWrapper(ProductController.get)
);

// CREATE PRODUCT
router.post(
  "/",
  appWrapper(ProductController.create)
);

// UPDATE PRODUCT
router.put(
  "/:id",
  appWrapper(ProductController.update)
);

// DELETE PRODUCT (SOFT DELETE)
router.delete(
  "/:id",
  appWrapper(ProductController.remove)
);

module.exports = router;
