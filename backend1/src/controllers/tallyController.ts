import { Request, Response } from "express";
import { tallyService } from "../services/tallyService";

export const tallyController = {
  async getAll(req: Request, res: Response) {
    try {
      const entries = await tallyService.getAllEntries();
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const entry = await tallyService.getEntryById(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const entry = await tallyService.createEntry(req.body);
      res.status(201).json(entry);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const entry = await tallyService.updateEntry(req.params.id, req.body);
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const deleted = await tallyService.deleteEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json({ message: "Entry deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

