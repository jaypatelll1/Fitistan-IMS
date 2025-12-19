// src/controllers/user.controller.js
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');
const ProductService = require('../services/product.service');
const InvalidRequestError = require("../../src/errorhandlers/InvalidRequestError")

class ProductController {

    static async create(req, res, next) {
      try {

        const product = req.body.data
        if(!product){
            throw new InvalidRequestError("Error ")
        }

        const users = await ProductService.createProduct({ product });

        return ResponseHandler.success(res, users, 'Users retrieved successfully');
      } catch (error) {
        logger.error('Error creating product', error);
        next(error);
      }
    }

}

module.exports = ProductController;
