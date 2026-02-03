"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const user_1 = require("../models/user");
const order_1 = require("../models/order");
const product_1 = require("../models/product");
class DashboardService {
    async getKPI() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const [totalUsers, todayOrders, monthOrders, products] = await Promise.all([
            user_1.User.countDocuments({ isVerified: true }),
            order_1.Order.find({
                orderDate: { $gte: today, $lt: tomorrow },
                paymentStatus: 'Paid'
            }),
            order_1.Order.find({
                orderDate: { $gte: startOfMonth },
                paymentStatus: 'Paid'
            }),
            product_1.Product.find()
        ]);
        const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const lowStockItems = products.filter(p => p.stock <= 10).length;
        return {
            totalUsers,
            todaySales,
            monthRevenue,
            lowStockItems
        };
    }
    async getDailySales(days = 30) {
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // End of today
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0); // Start of day
        const orders = await order_1.Order.find({
            orderDate: { $gte: startDate, $lte: endDate },
            paymentStatus: 'Paid'
        });
        const salesMap = new Map();
        orders.forEach(order => {
            const orderDate = new Date(order.orderDate);
            orderDate.setHours(0, 0, 0, 0); // Normalize to start of day
            const date = orderDate.toISOString().split('T')[0];
            const existing = salesMap.get(date) || { sales: 0, orders: 0 };
            existing.sales += order.totalAmount || 0;
            existing.orders += 1;
            salesMap.set(date, existing);
        });
        // Generate all dates in range, ensuring proper formatting
        const result = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);
            const dateStr = date.toISOString().split('T')[0];
            const data = salesMap.get(dateStr) || { sales: 0, orders: 0 };
            result.push({
                date: dateStr,
                sales: Number(data.sales.toFixed(2)), // Ensure proper number format
                orders: data.orders
            });
        }
        return result;
    }
}
exports.dashboardService = new DashboardService();
