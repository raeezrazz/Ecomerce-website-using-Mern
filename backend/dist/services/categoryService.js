"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const category_1 = require("../models/category");
const product_1 = require("../models/product");
class CategoryService {
    async getAllCategories() {
        const categories = await category_1.Category.find().sort({ name: 1 });
        // Update product count for each category
        for (const category of categories) {
            const count = await product_1.Product.countDocuments({ category: category.name });
            if (count !== category.productCount) {
                category.productCount = count;
                await category.save();
            }
        }
        return categories;
    }
    async getCategoryById(id) {
        return await category_1.Category.findById(id);
    }
    async createCategory(data) {
        const category = new category_1.Category(data);
        return await category.save();
    }
    async updateCategory(id, data) {
        return await category_1.Category.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteCategory(id) {
        const result = await category_1.Category.findByIdAndDelete(id);
        return !!result;
    }
}
exports.categoryService = new CategoryService();
