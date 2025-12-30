const express = require("express");
const router = express.Router({ mergeParams: true });

const ProductManager = require("../../businesslogic/managers/ProductManager");

const { generateBarcodeBuffer } = require("../../utils/barcodeGenerator");
const { appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businesslogic/accessmanagement/roleConstants");

// const validators = require("../../validators/product.validator");
// const validate = require("../../middleware/validation.middleware");

// ==========================
// GET ALL PRODUCTS
// ==========================
router.get(
  "/all",
  appWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const result = await ProductManager.getAllProductsPaginated(page, limit);
    if (!result.products || result.products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    return res.json({
      success: true,
      data: result.products,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        previous: result.previous,
        next: result.next,
      },
    });
  }, [ACCESS_ROLES.ALL])
);

// ==========================
// CREATE PRODUCT
// ==========================
router.post(
  "/create",
  // validate(validators.createProductSchema),
  appWrapper(async (req, res) => {

    // const{quantity,shelf_id, ...productData} = req.body;
    const productData = req.body;

    // Handle Image Upload
    if (req.files && req.files.image) {
      const { uploadToS3 } = require("../../services/s3Services");
      const file = req.files.image;

      const fileName = `products/${productData.sku}-${Date.now()}.png`;
      const imageUrl = await uploadToS3(file.data, fileName, file.mimetype);

      productData.product_image = imageUrl;
    }

    const product = await ProductManager.createProduct(productData);

    // const item = await itemManager.createItem({ product_id: product.product_id, shelf_id, name : productData.name},quantity);

    console.log("Product created:", product);



    return res.json({
      success: true,
      data: product,
      message: "Product created successfully",
    })

      ;
  }, [ACCESS_ROLES.ALL])
);

// ==========================
// GET PRODUCT BY ID
// ==========================
router.get(
  "/:id",
  appWrapper(async (req, res) => {
    const { id } = req.params;

    const product = await ProductManager.getProductById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  }, [ACCESS_ROLES.ALL])
);

// ==========================
// UPDATE PRODUCT
// ==========================
router.put(
  "/update/:id",
  // validate(validators.updateProductSchema),
  appWrapper(async (req, res) => {
    const { id } = req.params;

    const updatedProduct = await ProductManager.updateProduct(id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  }, [ACCESS_ROLES.ALL])
);

// ==========================
// DELETE PRODUCT
// ==========================
router.post(
  "/delete/:id",
  appWrapper(async (req, res) => {
    const { id } = req.params;

    const deletedProduct = await ProductManager.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: deletedProduct,
      message: "Product deleted successfully",
    });
  }, [ACCESS_ROLES.ALL])
);

router.get(
  "/sku/:sku",
  appWrapper(async (req, res) => {
    const { sku } = req.params;

    const product = await ProductManager.findBysku(sku);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  }, [ACCESS_ROLES.ALL])
);




// generate BARCODE BY barcode id
router.get(
  "/barcode/:barcode",
  appWrapper(async (req, res) => {
    const { barcode } = req.params;

    // ensure product exists
    const product = await ProductManager.generateBarcode(barcode);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // generate barcode image
    const png = await generateBarcodeBuffer(product.sku);

    res.set("Content-Type", "image/png");
    res.send(png);
    // return res.json({
    //   success: true,
    //   data: product,
    // });
  })
);


module.exports = router;
