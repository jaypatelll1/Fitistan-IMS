const ProductManager = require("../../businesslogic/managers/ProductManager");
const { appWrapper } = require("../../routes/routeWrapper");

class ProductController {
  // GET /products/all
  static getAllProducts = appWrapper(async (req, res) => {
    const products = await ProductManager.getAllProducts(req, res);
    return products;
  });

  // GET /products/:id
  static getProductById = appWrapper(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await ProductManager.getProductById(req, res);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return product;
  });

  // POST /products
  static createProduct = appWrapper(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Product data is required" });
    }

    const product = await ProductManager.createProduct(req, res);
    return product;
  });

  // PUT /products/:id
  static updateProduct = appWrapper(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const updatedProduct = await ProductManager.updateProduct(req, res);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return updatedProduct;
  });

  // DELETE /products/:id
  static deleteProduct = appWrapper(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    await ProductManager.deleteProduct(req, res);
    return res.status(200).json({ message: "Product deleted successfully" });
  });
}

module.exports = ProductController;
