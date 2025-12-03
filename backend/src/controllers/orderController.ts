import { Request, Response } from "express";
import { orderService } from "../services/orderService";

export const orderController = {
  async getAll(req: Request, res: Response) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const { status, type } = req.body;
      if (!status || !type) {
        return res.status(400).json({ error: "Status and type are required" });
      }
      const order = await orderService.updateOrderStatus(req.params.id, status, type);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};

