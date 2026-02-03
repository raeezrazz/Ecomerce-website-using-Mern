import { Request, Response } from "express";
import { productService } from "../services/productService";

// Helper function to transform product data for frontend
const transformProduct = (product: any) => {
  if (!product) return null;
  
  // Handle backward compatibility: old products have 'price', new ones have 'actualPrice'
  const actualPrice = product.actualPrice !== undefined ? product.actualPrice : (product.price || 0);
  const offerPrice = product.offerPrice !== undefined ? product.offerPrice : undefined;
  
  // Calculate display price (use offerPrice if available, otherwise actualPrice)
  const displayPrice = offerPrice && offerPrice > 0 ? offerPrice : actualPrice;
  
  return {
    id: product._id?.toString() || product.id,
    name: product.name,
    category: product.category || '',
    actualPrice: actualPrice,
    offerPrice: offerPrice,
    price: displayPrice, // Keep price for backward compatibility
    stock: product.stock || 0,
    description: product.description || '',
    images: product.images || [],
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
  };
};

export const productController = {
  async getAll(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      const transformed = products.map(transformProduct);
      res.json(transformed);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(transformProduct(product));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(transformProduct(product));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(transformProduct(product));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const deleted = await productService.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

