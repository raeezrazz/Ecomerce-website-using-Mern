import mongoose, { Schema } from "mongoose";

export interface IItemType {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemTypeSchema = new Schema<IItemType>({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ItemTypeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create index for faster search
ItemTypeSchema.index({ name: 'text' });

export const ItemType = mongoose.model<IItemType>("ItemType", ItemTypeSchema);

