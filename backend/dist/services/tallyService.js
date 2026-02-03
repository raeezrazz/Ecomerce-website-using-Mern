"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tallyService = void 0;
const tally_1 = require("../models/tally");
const warehouse_1 = require("../models/warehouse");
class TallyService {
    async getAllEntries() {
        return await tally_1.TallyEntry.find().sort({ date: -1 });
    }
    async getEntryById(id) {
        return await tally_1.TallyEntry.findById(id);
    }
    async createEntry(data) {
        // Calculate partsCost from usedParts
        if (data.usedParts && data.usedParts.length > 0) {
            data.partsCost = data.usedParts.reduce((sum, part) => sum + part.total, 0);
        }
        // Calculate totalAmount
        data.totalAmount = (data.serviceCharge || 0) + (data.partsCost || 0);
        // Reduce stock from warehouse
        if (data.usedParts && data.usedParts.length > 0) {
            await this.reduceWarehouseStock(data.usedParts);
        }
        const entry = new tally_1.TallyEntry(data);
        return await entry.save();
    }
    async updateEntry(id, data) {
        const oldEntry = await tally_1.TallyEntry.findById(id);
        // Restore old stock
        if (oldEntry && oldEntry.usedParts && oldEntry.usedParts.length > 0) {
            await this.restoreWarehouseStock(oldEntry.usedParts);
        }
        // Calculate partsCost from usedParts
        if (data.usedParts && data.usedParts.length > 0) {
            data.partsCost = data.usedParts.reduce((sum, part) => sum + part.total, 0);
        }
        // Calculate totalAmount
        data.totalAmount = (data.serviceCharge || 0) + (data.partsCost || 0);
        // Reduce new stock
        if (data.usedParts && data.usedParts.length > 0) {
            await this.reduceWarehouseStock(data.usedParts);
        }
        return await tally_1.TallyEntry.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteEntry(id) {
        const entry = await tally_1.TallyEntry.findById(id);
        if (entry && entry.usedParts && entry.usedParts.length > 0) {
            await this.restoreWarehouseStock(entry.usedParts);
        }
        const result = await tally_1.TallyEntry.findByIdAndDelete(id);
        return !!result;
    }
    async reduceWarehouseStock(usedParts) {
        for (const part of usedParts) {
            const item = await warehouse_1.WarehouseItem.findOne({ name: part.partName });
            if (item) {
                item.currentStock = Math.max(0, item.currentStock - part.quantity);
                item.lastUpdated = new Date();
                await item.save();
            }
        }
    }
    async restoreWarehouseStock(usedParts) {
        for (const part of usedParts) {
            const item = await warehouse_1.WarehouseItem.findOne({ name: part.partName });
            if (item) {
                item.currentStock += part.quantity;
                item.lastUpdated = new Date();
                await item.save();
            }
        }
    }
}
exports.tallyService = new TallyService();
