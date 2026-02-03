import mongoose, { Schema } from "mongoose";

export interface IProduct {
  _id: string;
  name: string;
  category: string; // Changed to string to support dynamic categories
  actualPrice: number;
  offerPrice?: number; // Optional offer price
  stock: number;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true 
  },
  actualPrice: { type: Number, required: true, min: 0 },
  offerPrice: { type: Number, min: 0 },
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

