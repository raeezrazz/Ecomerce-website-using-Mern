"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const order_1 = require("../models/order");
class OrderService {
    async getAllOrders() {
        return await order_1.Order.find().sort({ orderDate: -1 });
    }
    async getOrderById(id) {
        return await order_1.Order.findById(id);
    }
    async createOrder(data) {
        const order = new order_1.Order(data);
        return await order.save();
    }
    async updateOrderStatus(id, status, type) {
        const update = {};
        if (type === "delivery") {
            update.deliveryStatus = status;
            if (status === "Delivered") {
                update.deliveryDate = new Date();
            }
        }
        else if (type === "payment") {
            update.paymentStatus = status;
        }
        return await order_1.Order.findByIdAndUpdate(id, update, { new: true });
    }
}
exports.orderService = new OrderService();
