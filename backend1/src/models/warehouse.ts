import mongoose, { Schema } from "mongoose";

export interface IWarehouseItem {
  _id: string;
  name: string;
  sku: string;
  category: 'Digital Meters' | 'Meter Spares' | 'Accessories';
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
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['Digital Meters', 'Meter Spares', 'Accessories'],
    required: true
  },
  currentStock: { type: Number, required: true, min: 0, default: 0 },
  unit: { type: String, default: 'pcs' },
  costPrice: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  location: { type: String, default: 'Main Warehouse' },
  minStockLevel: { type: Number, default: 10 },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

WarehouseItemSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export const WarehouseItem = mongoose.model<IWarehouseItem>("WarehouseItem", WarehouseItemSchema);

