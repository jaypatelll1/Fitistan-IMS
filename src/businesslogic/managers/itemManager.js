const ItemModel = require("../../models/itemModel");
const ProductModel = require("../../models/productModel");

class itemManager {

  static async createItem( product_id, shelf_id, quantity ) {
    try {
        const itemModel = new ItemModel();
        const productModel = new ProductModel();

        console.log("payload", { product_id, shelf_id, quantity });

        // 1. Verify product using SKU (barcode == sku)
        const Product = await productModel.findById(product_id);
        console.log("Product",  Product);

        if (!Product) {
            return null; // product not found
        }

       
        if (quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }

        // 2. Insert items (1 row = 1 physical item)
        const createdItems = [];

        for (let i = 0; i < quantity; i++) {
            const item = await itemModel.create({
                product_id,
                name: Product.name,
                shelf_id: shelf_id,
            });

            createdItems.push(item);
        }

        return createdItems; // return all created rows
    } catch (error) {
        throw new Error(error.message);
    }
}



static async removeItemStock(product_id, quantity) {
    try {
        const itemModel = new ItemModel();

        if (quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }

       
        const items = await itemModel.countByProductId(product_id);
        if (items < quantity) {
            throw new Error("Insufficient stock");
        }

        // FOR LOOP — remove ONE item per iteration
        for (let i = 0; i < quantity; i++) {
            const deleted = await itemModel.softDelete(product_id);

            if (deleted === 0) {
                throw new Error("Stock exhausted during removal");
            }
        }

        return { removed: quantity };

    } catch (error) {
        throw new Error(`Failed to remove stock: ${error.message}`);
    }
}



}
module.exports = itemManager;