const ProductModel = require("../../models/product.model");



class ProductManager {

  static async getAllProducts(userId) {
    const productModel = new ProductModel(userId);
    return productModel.getAllProducts();
  }

  static async getProductById(id, userId) {
    const productModel = new ProductModel(userId);
    return productModel.getProductById(id);
  }

  static async createProduct(data, userId) {
    const productModel = new ProductModel(userId);
    return productModel.createProduct(data);
  }

  static async updateProduct(id, data, userId) {
    const productModel = new ProductModel(userId);
    return productModel.updateProduct(id, data);
  }

  static async deleteProduct(id, userId) {
    const productModel = new ProductModel(userId);
    return productModel.deleteProduct(id);
  }
}

module.exports = ProductManager;



