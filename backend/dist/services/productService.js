"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_1 = require("../models/product");
/** Generate a unique SKU so we never save sku: null (avoids E11000 duplicate key on unique index). */
function generateSku() {
    return `PRD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
class ProductService {
    async getAllProducts() {
        return await product_1.Product.find().sort({ createdAt: -1 });
    }
    async getProductById(id) {
        return await product_1.Product.findById(id);
    }
    async createProduct(data) {
        const sku = (data.sku && String(data.sku).trim()) || generateSku();
        const product = new product_1.Product({ ...data, sku });
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
