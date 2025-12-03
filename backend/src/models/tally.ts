import mongoose, { Schema } from "mongoose";

export interface IUsedPart {
  id: string;
  partName: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface ITallyEntry {
  _id: string;
  date: Date;
  customerName: string;
  phone: string;
  itemType: string;
  serviceType: 'repair' | 'sale';
  status: 'pending' | 'in-progress' | 'completed' | 'delivered';
  serviceCharge: number;
  partsCost: number;
  usedParts: IUsedPart[];
  totalAmount: number;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  dateCompleted?: Date;
  notes: string;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UsedPartSchema = new Schema<IUsedPart>({
  id: { type: String, required: true },
  partName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  rate: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const TallyEntrySchema = new Schema<ITallyEntry>({
  date: { type: Date, required: true, default: Date.now },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  itemType: { type: String, required: true },
  serviceType: {
    type: String,
    enum: ['repair', 'sale'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'delivered'],
    default: 'pending'
  },
  serviceCharge: { type: Number, required: true, min: 0 },
  partsCost: { type: Number, default: 0, min: 0 },
  usedParts: { type: [UsedPartSchema], default: [] },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'partial'],
    default: 'unpaid'
  },
  dateCompleted: { type: Date },
  notes: { type: String, default: '' },
  photos: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TallyEntrySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const TallyEntry = mongoose.model<ITallyEntry>("TallyEntry", TallyEntrySchema);

