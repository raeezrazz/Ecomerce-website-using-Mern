import { Request, Response } from "express";
import { itemTypeService } from "../services/itemTypeService";

export const itemTypeController = {
  async getAll(req: Request, res: Response) {
    try {
      const itemTypes = await itemTypeService.getAllItemTypes();
      res.json(itemTypes.map(item => ({
        id: item._id.toString(),
        name: item.name,
      })));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      const query = typeof q === 'string' ? q : '';
      const itemTypes = await itemTypeService.searchItemTypes(query);
      res.json(itemTypes.map(item => ({
        id: item._id.toString(),
        name: item.name,
      })));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: "Item type name is required" });
      }
      const itemType = await itemTypeService.createItemType(name);
      res.status(201).json({
        id: itemType._id.toString(),
        name: itemType.name,
      });
    } catch (error: any) {
      if (error.message === "Item type already exists") {
        return res.status(409).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const deleted = await itemTypeService.deleteItemType(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Item type not found" });
      }
      res.json({ message: "Item type deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

