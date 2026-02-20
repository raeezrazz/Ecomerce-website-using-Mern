"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboardService_1 = require("../services/dashboardService");
exports.dashboardController = {
    async getKPI(req, res) {
        try {
            const kpi = await dashboardService_1.dashboardService.getKPI();
            res.json(kpi);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getDailySales(req, res) {
        try {
            const days = parseInt(req.query.days) || 30;
            const sales = await dashboardService_1.dashboardService.getDailySales(days);
            res.json(sales);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getReport(req, res) {
        try {
            const daysParam = req.query.days;
            const monthParam = req.query.month;
            const yearParam = req.query.year;
            const days = daysParam ? parseInt(daysParam, 10) : undefined;
            const month = monthParam ? parseInt(monthParam, 10) : undefined;
            const year = yearParam ? parseInt(yearParam, 10) : undefined;
            const report = await dashboardService_1.dashboardService.getReportData({ month, year, days });
            res.json(report);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
