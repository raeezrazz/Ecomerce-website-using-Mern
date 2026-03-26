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
        this.prepareTallyAmounts(data);
        this.validateByType(data);
        // Reduce stock from warehouse based on entry type
        if (data.serviceType === "repair" && data.usedParts && data.usedParts.length > 0) {
            await this.reduceWarehouseStockForUsedParts(data.usedParts);
        }
        if (data.serviceType === "sale" && data.saleItems && data.saleItems.length > 0) {
            await this.reduceWarehouseStockForSaleItems(data.saleItems);
        }
        const entry = new tally_1.TallyEntry(data);
        return await entry.save();
    }
    async updateEntry(id, data) {
        const oldEntry = await tally_1.TallyEntry.findById(id);
        // Restore old stock for previous entry values
        if (oldEntry?.serviceType === "repair" && oldEntry.usedParts && oldEntry.usedParts.length > 0) {
            await this.restoreWarehouseStockForUsedParts(oldEntry.usedParts);
        }
        if (oldEntry?.serviceType === "sale" && oldEntry.saleItems && oldEntry.saleItems.length > 0) {
            await this.restoreWarehouseStockForSaleItems(oldEntry.saleItems);
        }
        this.prepareTallyAmounts(data);
        this.validateByType(data);
        // Reduce new stock
        if (data.serviceType === "repair" && data.usedParts && data.usedParts.length > 0) {
            await this.reduceWarehouseStockForUsedParts(data.usedParts);
        }
        if (data.serviceType === "sale" && data.saleItems && data.saleItems.length > 0) {
            await this.reduceWarehouseStockForSaleItems(data.saleItems);
        }
        return await tally_1.TallyEntry.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteEntry(id) {
        const entry = await tally_1.TallyEntry.findById(id);
        if (entry?.serviceType === "repair" && entry.usedParts && entry.usedParts.length > 0) {
            await this.restoreWarehouseStockForUsedParts(entry.usedParts);
        }
        if (entry?.serviceType === "sale" && entry.saleItems && entry.saleItems.length > 0) {
            await this.restoreWarehouseStockForSaleItems(entry.saleItems);
        }
        const result = await tally_1.TallyEntry.findByIdAndDelete(id);
        return !!result;
    }
    prepareTallyAmounts(data) {
        data.serviceType = data.serviceType ?? data.type ?? "repair";
        data.type = data.serviceType;
        data.itemType = data.itemType ?? data.item ?? "";
        data.item = data.itemType;
        data.serviceCharge = data.serviceCharge ?? data.laborCost ?? 0;
        data.laborCost = data.serviceCharge;
        if (data.serviceType === "sale") {
            const saleItems = data.saleItems ?? [];
            data.usedParts = [];
            data.partsCost = 0;
            data.serviceCharge = 0;
            data.laborCost = 0;
            const saleItemsTotal = saleItems.reduce((sum, item) => sum + (item.total || 0), 0);
            const directItemPrice = data.itemPrice ?? 0;
            const effectiveItemPrice = saleItemsTotal > 0 ? saleItemsTotal : directItemPrice;
            data.itemPrice = effectiveItemPrice;
            data.totalAmount = effectiveItemPrice;
            data.total = data.totalAmount;
            return;
        }
        const usedParts = data.usedParts ?? [];
        data.saleItems = [];
        data.partsCost = usedParts.reduce((sum, part) => sum + (part.total || 0), 0);
        data.totalAmount = (data.serviceCharge || 0) + (data.partsCost || 0);
        data.itemPrice = 0;
        data.total = data.totalAmount;
    }
    validateByType(data) {
        if (data.serviceType === "sale") {
            if ((data.itemPrice ?? 0) <= 0) {
                throw new Error("Item price is required for sale entries");
            }
            return;
        }
        const labor = data.serviceCharge ?? 0;
        const parts = data.partsCost ?? 0;
        if (labor <= 0 && parts <= 0) {
            throw new Error("Labor cost or parts cost is required for repair entries");
        }
    }
    async reduceWarehouseStockForUsedParts(usedParts) {
        for (const part of usedParts) {
            const item = await warehouse_1.WarehouseItem.findOne({ name: part.partName });
            if (item) {
                item.currentStock = Math.max(0, item.currentStock - part.quantity);
                item.lastUpdated = new Date();
                await item.save();
            }
        }
    }
    async restoreWarehouseStockForUsedParts(usedParts) {
        for (const part of usedParts) {
            const item = await warehouse_1.WarehouseItem.findOne({ name: part.partName });
            if (item) {
                item.currentStock += part.quantity;
                item.lastUpdated = new Date();
                await item.save();
            }
        }
    }
    async reduceWarehouseStockForSaleItems(saleItems) {
        for (const saleItem of saleItems) {
            const item = await warehouse_1.WarehouseItem.findById(saleItem.warehouseItemId);
            if (item) {
                item.currentStock = Math.max(0, item.currentStock - saleItem.quantity);
                item.lastUpdated = new Date();
                await item.save();
            }
        }
    }
    async restoreWarehouseStockForSaleItems(saleItems) {
        for (const saleItem of saleItems) {
            const item = await warehouse_1.WarehouseItem.findById(saleItem.warehouseItemId);
            if (item) {
                item.currentStock += saleItem.quantity;
                item.lastUpdated = new Date();
                await item.save();
            }
        }
    }
}
exports.tallyService = new TallyService();
