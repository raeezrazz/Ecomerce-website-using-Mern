"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const orderService_1 = require("../services/orderService");
exports.orderController = {
    async getAll(req, res) {
        try {
            const orders = await orderService_1.orderService.getAllOrders();
            res.json(orders);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getById(req, res) {
        try {
            const order = await orderService_1.orderService.getOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async updateStatus(req, res) {
        try {
            const { status, type } = req.body;
            if (!status || !type) {
                return res.status(400).json({ error: "Status and type are required" });
            }
            const order = await orderService_1.orderService.updateOrderStatus(req.params.id, status, type);
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
