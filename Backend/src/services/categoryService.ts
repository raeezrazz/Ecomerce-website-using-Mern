import { Category, ICategory } from "../models/category";
import { Product } from "../models/product";

class CategoryService {
  async getAllCategories(): Promise<ICategory[]> {
    const categories = await Category.find().sort({ name: 1 });
    
    // Update product count for each category
    for (const category of categories) {
      const count = await Product.countDocuments({ category: category.name });
      if (count !== category.productCount) {
        category.productCount = count;
        await category.save();
      }
    }
    
    return categories;
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(data);
    return await category.save();
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  }
}

export const categoryService = new CategoryService();

