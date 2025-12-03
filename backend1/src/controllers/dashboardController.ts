import { Request, Response } from "express";
import { dashboardService } from "../services/dashboardService";

export const dashboardController = {
  async getKPI(req: Request, res: Response) {
    try {
      const kpi = await dashboardService.getKPI();
      res.json(kpi);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getDailySales(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const sales = await dashboardService.getDailySales(days);
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

