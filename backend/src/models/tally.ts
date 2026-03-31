import mongoose, { Schema } from "mongoose";

export interface IUsedPart {
  id: string;
  partName: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface ISaleItem {
  id: string;
  warehouseItemId: string;
  itemName: string;
  quantity: number;
  actualPrice: number;
  sellingPrice: number;
  total: number;
}

export interface ITallyEntry {
  _id: string;
  date: Date;
  customerName: string;
  phone: string;
  item?: string;
  itemType: string;
  type?: 'repair' | 'sale';
  serviceType: 'repair' | 'sale';
  status: 'pending' | 'in-progress' | 'completed' | 'delivered';
  laborCost?: number;
  serviceCharge: number;
  partsCost: number;
  usedParts: IUsedPart[];
  saleItems: ISaleItem[];
  itemPrice?: number;
  /** Sum before discount (labor + parts for repair; sum of sale lines / quick total for sale). */
  subtotal: number;
  discountAmount: number;
  total?: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  /** Optional job / invoice / work order reference for records. */
  reference?: string;
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

const SaleItemSchema = new Schema<ISaleItem>({
  id: { type: String, required: true },
  warehouseItemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  actualPrice: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const TallyEntrySchema = new Schema<ITallyEntry>({
  date: { type: Date, required: true, default: Date.now },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  item: { type: String, default: '' },
  itemType: { type: String, required: true },
  type: { type: String, enum: ['repair', 'sale'] },
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
  laborCost: { type: Number, default: 0, min: 0 },
  serviceCharge: { type: Number, required: true, min: 0 },
  partsCost: { type: Number, default: 0, min: 0 },
  usedParts: { type: [UsedPartSchema], default: [] },
  saleItems: { type: [SaleItemSchema], default: [] },
  itemPrice: { type: Number, default: 0, min: 0 },
  subtotal: { type: Number, default: 0, min: 0 },
  discountAmount: { type: Number, default: 0, min: 0 },
  total: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'partial'],
    default: 'unpaid'
  },
  reference: { type: String, default: '' },
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

