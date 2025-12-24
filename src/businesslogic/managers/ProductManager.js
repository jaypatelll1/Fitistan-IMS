const ProductModel = require("../../models/productModel");


const productModel = new ProductModel(); // no userId for now
class ProductManager {

   static async getAllProducts() {
       try {
         const products = await productModel.findAll();
         return products;
       } catch (err) {
        throw new Error(`Failed to create shelf: ${err.message}`);
    }
       }
  

   static async getProductById(id) {
       try {
         const product = await productModel.findById(id);   
            if (!product) {

                return null;
            }
            return product;
       }
         catch (err) {
        throw new Error(`Failed to get product by ID: ${err.message}`);
    }
    };

    static async createProduct(productData) {
        try {
          const productModel = new ProductModel();
         const verifyProduct = await productModel.findBySkuId(productData.sku);
         if (verifyProduct) {
            throw new Error('Product with this SKU already exists.');
         }

          const product = await productModel.create(productData);
          return product;
            
        } catch (err) {
        throw new Error(`Failed to create product: ${err.message}`);
    }       


    }
    static async updateProduct(id, data) {
        try {
          const productModel = new ProductModel();
          const verifyProduct = await productModel.findById(id);
          if (!verifyProduct ) {
            throw new Error('product does not exist');
         }
          const product = await productModel.update(id, data);
          if (!product) {
            return null;
          }
          return product;
        } catch (err) {
        throw new Error(`Failed to update product: ${err.message}`);
    }
    };
    static async deleteProduct(id) {
        try {
          const product = await productModel.softDelete(id);
          if (!product) {
            return null;
          }
          return product;
        } catch (err) {
        throw new Error(`Failed to delete product: ${err.message}`);
    }
    };

    static async findBysku(sku) {
        try {
          const product = await productModel.findBySkuId(sku);
          return product;
        } catch (err) {
        throw new Error(`Failed to find product by SKU: ${err.message}`);
    }};

    static async findByBarcode(barcode) {
        try {
          const product = await productModel.findByBarcode(barcode);
          return product;
        } catch (err) {
        throw new Error(`Failed to find product by barcode: ${err.message}`);
    }}

}

module.exports = ProductManager;
