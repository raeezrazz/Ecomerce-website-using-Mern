import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/categoryService";

// Helper function to transform category data for frontend
const transformCategory = (category: any) => {
  if (!category) return null;
  
  return {
    id: category._id?.toString() || category.id,
    name: category.name || '',
    description: category.description || '',
    productCount: category.productCount || 0,
  };
};

export const categoryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      const transformedCategories = categories.map(transformCategory);
      res.json(transformedCategories);
    } catch (error: any) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(transformCategory(category));
    } catch (error: any) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(transformCategory(category));
    } catch (error: any) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(transformCategory(category));
    } catch (error: any) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await categoryService.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  }
};

