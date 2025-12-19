// src/services/user.service.js
const ProductModel = require("../models/product.model");

class ProductService {
    
    static async createProduct({ product }) {
        return await ProductModel.createProduct({ product });
    }

}

module.exports = ProductService;
