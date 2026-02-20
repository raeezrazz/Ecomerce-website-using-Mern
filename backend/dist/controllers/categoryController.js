"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const categoryService_1 = require("../services/categoryService");
// Helper function to transform category data for frontend
const transformCategory = (category) => {
    if (!category)
        return null;
    return {
        id: category._id?.toString() || category.id,
        name: category.name || '',
        description: category.description || '',
        thumbnail: category.thumbnail || '',
        productCount: category.productCount || 0,
    };
};
exports.categoryController = {
    async getAll(req, res, next) {
        try {
            const categories = await categoryService_1.categoryService.getAllCategories();
            const transformedCategories = categories.map(transformCategory);
            res.json(transformedCategories);
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const category = await categoryService_1.categoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.json(transformCategory(category));
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const category = await categoryService_1.categoryService.createCategory(req.body);
            res.status(201).json(transformCategory(category));
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const category = await categoryService_1.categoryService.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.json(transformCategory(category));
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const deleted = await categoryService_1.categoryService.deleteCategory(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.json({ message: "Category deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    }
};
