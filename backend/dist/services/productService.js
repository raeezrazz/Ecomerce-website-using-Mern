"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_1 = require("../models/product");
class ProductService {
    async getAllProducts() {
        return await product_1.Product.find().sort({ createdAt: -1 });
    }
    async getProductById(id) {
        return await product_1.Product.findById(id);
    }
    async createProduct(data) {
        const product = new product_1.Product(data);
        return await product.save();
    }
    async updateProduct(id, data) {
        return await product_1.Product.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteProduct(id) {
        const result = await product_1.Product.findByIdAndDelete(id);
        return !!result;
    }
}
exports.productService = new ProductService();
