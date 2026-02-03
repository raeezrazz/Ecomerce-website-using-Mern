import mongoose, { Schema } from "mongoose";

export interface IWarehouseItem {
  _id: string;
  name: string;
  sku: string;
  category: string; // Changed to string to support dynamic categories
  currentStock: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  location: string;
  minStockLevel: number;
  lastUpdated: Date;
  createdAt: Date;
}

const WarehouseItemSchema = new Schema<IWarehouseItem>({
  name: { 
    type: String, 
    required: [true, 'Item name is required'],
    trim: true
  },
  sku: { 
    type: String, 
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  currentStock: { 
    type: Number, 
    required: [true, 'Current stock is required'], 
    min: [0, 'Current stock cannot be negative'], 
    default: 0 
  },
  unit: { 
    type: String, 
    default: 'pcs',
    trim: true
  },
  costPrice: { 
    type: Number, 
    required: [true, 'Cost price is required'], 
    min: [0, 'Cost price cannot be negative'] 
  },
  sellingPrice: { 
    type: Number, 
    required: [true, 'Selling price is required'], 
    min: [0, 'Selling price cannot be negative'] 
  },
  location: { 
    type: String, 
    default: 'Main Warehouse',
    trim: true
  },
  minStockLevel: { 
    type: Number, 
    default: 10,
    min: 0
  },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: false // We're handling timestamps manually
});

WarehouseItemSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export const WarehouseItem = mongoose.model<IWarehouseItem>("WarehouseItem", WarehouseItemSchema);

