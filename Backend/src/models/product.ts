import mongoose, { Schema } from "mongoose";

export interface IProduct {
  _id: string;
  name: string;
  sku: string;
  category: 'Digital Meters' | 'Meter Spares' | 'Accessories';
  price: number;
  stock: number;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Digital Meters', 'Meter Spares', 'Accessories'],
    required: true 
  },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);

