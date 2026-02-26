import { Product, IProduct } from "../models/product";

/** Generate a unique SKU so we never save sku: null (avoids E11000 duplicate key on unique index). */
function generateSku(): string {
  return `PRD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

class ProductService {
  async getAllProducts(): Promise<IProduct[]> {
    return await Product.find().sort({ createdAt: -1 });
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    const sku = (data.sku && String(data.sku).trim()) || generateSku();
    const product = new Product({ ...data, sku });
    return await product.save();
  }

  async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }
}

export const productService = new ProductService();

