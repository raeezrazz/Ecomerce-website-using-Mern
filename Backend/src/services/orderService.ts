import { Order, IOrder } from "../models/order";

class OrderService {
  async getAllOrders(): Promise<IOrder[]> {
    return await Order.find().sort({ orderDate: -1 });
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  }

  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(data);
    return await order.save();
  }

  async updateOrderStatus(
    id: string,
    status: string,
    type: "delivery" | "payment"
  ): Promise<IOrder | null> {
    const update: any = {};
    if (type === "delivery") {
      update.deliveryStatus = status;
      if (status === "Delivered") {
        update.deliveryDate = new Date();
      }
    } else if (type === "payment") {
      update.paymentStatus = status;
    }
    return await Order.findByIdAndUpdate(id, update, { new: true });
  }
}

export const orderService = new OrderService();

