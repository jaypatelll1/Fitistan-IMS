const ProductModel = require("../../models/productModel");
const { appWrapper } = require("../../routes/routeWrapper");

const productModel = new ProductModel(); // no userId for now
class ProductManager {

    static getAllProducts = appWrapper(async (req, res) => {
        const products = await productModel.findAll();
        res.json({ data: products });
    });

    static getProductById = appWrapper(async (req, res) => {
        const product = await productModel.findById(req.params.id);
        res.json({ data: product });
    });

    static createProduct = appWrapper(async (req, res) => {
        const product = await productModel.create(req.body);
        res.status(201).json({ data: product });
    });

    static updateProduct = appWrapper(async (req, res) => {
        const product = await productModel.update(req.params.id, req.body);
        res.json({ data: product });
    });

    static deleteProduct = appWrapper(async (req, res) => {
        await productModel.delete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    });
}

module.exports = ProductManager;