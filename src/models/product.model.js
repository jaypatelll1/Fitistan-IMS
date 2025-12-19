const db = require("../config/database");

class ProductModel {

    static async createProduct({ product }) {
        try {
            const [createdProduct] = await db
                .withSchema("public")
                .insert({
                    name: product.name,
                    description: product.description,
                    stock_quantity: product.stock_quantity,
                    sku: product.sku,
                    barcode: product.barcode,
                    supplier: product.supplier,
                    vendor_id: product.vendor_id
                })
                .into("products")
                .returning("product_id");

            return createdProduct;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

}

module.exports = ProductModel;
