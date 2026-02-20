"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const user_1 = require("../models/user");
const order_1 = require("../models/order");
const product_1 = require("../models/product");
const tally_1 = require("../models/tally");
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
    /**
     * Get report data with service (repairs), order (e-commerce), and sales (tally sales) breakdown by day.
     * Supports either month+year or days query.
     * @param month 1-12 (optional)
     * @param year e.g. 2025 (optional)
     * @param days if provided, last N days; otherwise use month/year range
     */
    async getReportData(params) {
        const now = new Date();
        let startDate;
        let endDate;
        let label;
        if (params.days != null && params.days > 0) {
            const days = Math.min(Math.max(1, params.days), 365);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - days);
            startDate.setHours(0, 0, 0, 0);
            label = `Last ${days} days`;
        }
        else if (params.month != null && params.year != null) {
            const month = Math.max(1, Math.min(12, params.month));
            const year = params.year;
            startDate = new Date(year, month - 1, 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(year, month, 0); // last day of month
            endDate.setHours(23, 59, 59, 999);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            label = `${monthNames[month - 1]} ${year}`;
        }
        else {
            // default: current month
            const y = now.getFullYear();
            const m = now.getMonth();
            startDate = new Date(y, m, 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            label = `${monthNames[m]} ${y}`;
        }
        const [orders, tallyEntries] = await Promise.all([
            order_1.Order.find({
                orderDate: { $gte: startDate, $lte: endDate },
                paymentStatus: 'Paid'
            }),
            tally_1.TallyEntry.find({
                date: { $gte: startDate, $lte: endDate }
            })
        ]);
        const dayMap = new Map();
        orders.forEach(order => {
            const d = new Date(order.orderDate);
            d.setHours(0, 0, 0, 0);
            const dateStr = d.toISOString().split('T')[0];
            const existing = dayMap.get(dateStr) || { orders: 0, orderRevenue: 0, services: 0, serviceRevenue: 0, sales: 0, salesRevenue: 0 };
            existing.orders += 1;
            existing.orderRevenue += order.totalAmount || 0;
            dayMap.set(dateStr, existing);
        });
        tallyEntries.forEach(entry => {
            const d = new Date(entry.date);
            d.setHours(0, 0, 0, 0);
            const dateStr = d.toISOString().split('T')[0];
            const existing = dayMap.get(dateStr) || { orders: 0, orderRevenue: 0, services: 0, serviceRevenue: 0, sales: 0, salesRevenue: 0 };
            const amount = entry.totalAmount || 0;
            if (entry.serviceType === 'repair') {
                existing.services += 1;
                existing.serviceRevenue += amount;
            }
            else {
                existing.sales += 1;
                existing.salesRevenue += amount;
            }
            dayMap.set(dateStr, existing);
        });
        const numDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        const result = [];
        for (let i = 0; i < numDays; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);
            const dateStr = date.toISOString().split('T')[0];
            if (date.getTime() > endDate.getTime())
                break;
            const data = dayMap.get(dateStr) || { orders: 0, orderRevenue: 0, services: 0, serviceRevenue: 0, sales: 0, salesRevenue: 0 };
            result.push({
                date: dateStr,
                orders: data.orders,
                orderRevenue: Number((data.orderRevenue).toFixed(2)),
                services: data.services,
                serviceRevenue: Number((data.serviceRevenue).toFixed(2)),
                sales: data.sales,
                salesRevenue: Number((data.salesRevenue).toFixed(2))
            });
        }
        return { period: { start: startDate.toISOString().split('T')[0], end: endDate.toISOString().split('T')[0], label }, daily: result };
    }
}
exports.dashboardService = new DashboardService();
