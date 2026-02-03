import mongoose, { Schema } from "mongoose";

export interface ICustomer {
  _id: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CustomerSchema.index({ name: 'text' });
CustomerSchema.index({ name: 1, phone: 1 }, { unique: true });

CustomerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);
