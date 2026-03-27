import { TallyEntry, ITallyEntry } from "../models/tally";
import { WarehouseItem } from "../models/warehouse";

function toNum(v: unknown, fallback = 0): number {
  if (v === null || v === undefined || v === "") return fallback;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

class TallyService {
  async getAllEntries(): Promise<ITallyEntry[]> {
    return await TallyEntry.find().sort({ date: -1 });
  }

  async getEntryById(id: string): Promise<ITallyEntry | null> {
    return await TallyEntry.findById(id);
  }

  async createEntry(data: Partial<ITallyEntry>): Promise<ITallyEntry> {
    this.prepareTallyAmounts(data);
    this.validateByType(data);

    // Reduce stock from warehouse based on entry type
    if (data.serviceType === "repair" && data.usedParts && data.usedParts.length > 0) {
      await this.reduceWarehouseStockForUsedParts(data.usedParts);
    }
    if (data.serviceType === "sale" && data.saleItems && data.saleItems.length > 0) {
      await this.reduceWarehouseStockForSaleItems(data.saleItems);
    }

    const entry = new TallyEntry(data);
    return await entry.save();
  }

  async updateEntry(id: string, data: Partial<ITallyEntry>): Promise<ITallyEntry | null> {
    const oldEntry = await TallyEntry.findById(id);
    
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

    return await TallyEntry.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteEntry(id: string): Promise<boolean> {
    const entry = await TallyEntry.findById(id);
    if (entry?.serviceType === "repair" && entry.usedParts && entry.usedParts.length > 0) {
      await this.restoreWarehouseStockForUsedParts(entry.usedParts);
    }
    if (entry?.serviceType === "sale" && entry.saleItems && entry.saleItems.length > 0) {
      await this.restoreWarehouseStockForSaleItems(entry.saleItems);
    }
    const result = await TallyEntry.findByIdAndDelete(id);
    return !!result;
  }

  private prepareTallyAmounts(data: Partial<ITallyEntry>) {
    data.serviceType = data.serviceType ?? data.type ?? "repair";
    data.type = data.serviceType;
    const itemLabel = String(data.itemType ?? data.item ?? "").trim();
    data.itemType = itemLabel;
    data.item = itemLabel;
    data.serviceCharge = toNum(data.serviceCharge ?? data.laborCost, 0);
    data.laborCost = data.serviceCharge;

    if (data.serviceType === "sale") {
      const saleItems = data.saleItems ?? [];
      data.usedParts = [];
      data.partsCost = 0;
      data.serviceCharge = 0;
      data.laborCost = 0;
      const saleItemsTotal = saleItems.reduce(
        (sum, item) => sum + toNum(item.total, 0),
        0
      );
      const directItemPrice = toNum(data.itemPrice, 0);
      const effectiveItemPrice = saleItemsTotal > 0 ? saleItemsTotal : directItemPrice;
      data.itemPrice = effectiveItemPrice;
      data.totalAmount = effectiveItemPrice;
      data.total = data.totalAmount;
      return;
    }

    const usedParts = data.usedParts ?? [];
    data.saleItems = [];
    data.partsCost = usedParts.reduce((sum, part) => sum + toNum(part.total, 0), 0);
    data.serviceCharge = toNum(data.serviceCharge, 0);
    data.laborCost = data.serviceCharge;
    data.totalAmount = data.serviceCharge + (data.partsCost || 0);
    data.itemPrice = 0;
    data.total = data.totalAmount;
  }

  private validateByType(data: Partial<ITallyEntry>) {
    const itemLabel = String(data.itemType ?? data.item ?? "").trim();
    if (!itemLabel) {
      throw new Error("Item / description is required");
    }
    data.itemType = itemLabel;
    data.item = itemLabel;

    if (data.serviceType === "sale") {
      const price = toNum(data.itemPrice, 0);
      if (price <= 0) {
        throw new Error("Item price is required for sale entries");
      }
      return;
    }

    const labor = toNum(data.serviceCharge, 0);
    const parts = toNum(data.partsCost, 0);
    if (labor <= 0 && parts <= 0) {
      throw new Error("Labor cost or parts cost is required for repair entries");
    }
  }

  private async reduceWarehouseStockForUsedParts(usedParts: ITallyEntry["usedParts"]) {
    for (const part of usedParts) {
      const item = await WarehouseItem.findOne({ name: part.partName });
      if (item) {
        item.currentStock = Math.max(0, item.currentStock - part.quantity);
        item.lastUpdated = new Date();
        await item.save();
      }
    }
  }

  private async restoreWarehouseStockForUsedParts(usedParts: ITallyEntry["usedParts"]) {
    for (const part of usedParts) {
      const item = await WarehouseItem.findOne({ name: part.partName });
      if (item) {
        item.currentStock += part.quantity;
        item.lastUpdated = new Date();
        await item.save();
      }
    }
  }

  private async reduceWarehouseStockForSaleItems(saleItems: ITallyEntry["saleItems"]) {
    for (const saleItem of saleItems) {
      const item = await WarehouseItem.findById(saleItem.warehouseItemId);
      if (item) {
        item.currentStock = Math.max(0, item.currentStock - saleItem.quantity);
        item.lastUpdated = new Date();
        await item.save();
      }
    }
  }

  private async restoreWarehouseStockForSaleItems(saleItems: ITallyEntry["saleItems"]) {
    for (const saleItem of saleItems) {
      const item = await WarehouseItem.findById(saleItem.warehouseItemId);
      if (item) {
        item.currentStock += saleItem.quantity;
        item.lastUpdated = new Date();
        await item.save();
      }
    }
  }
}

export const tallyService = new TallyService();

