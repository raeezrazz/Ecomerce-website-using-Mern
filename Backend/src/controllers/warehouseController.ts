import { Request, Response } from "express";
import { warehouseService } from "../services/warehouseService";

export const warehouseController = {
  async getAll(req: Request, res: Response) {
    try {
      const items = await warehouseService.getAllItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const item = await warehouseService.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const item = await warehouseService.createItem(req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const item = await warehouseService.updateItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const deleted = await warehouseService.deleteItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLowStock(req: Request, res: Response) {
    try {
      const items = await warehouseService.getLowStockItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

