import mongoose, { Schema } from "mongoose";

export interface IOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id: string;
  customerId: string;
  customerName: string;
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid';
  deliveryStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const OrderSchema = new Schema<IOrder>({
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid'
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  shippingAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);

