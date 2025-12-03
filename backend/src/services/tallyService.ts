import { TallyEntry, ITallyEntry } from "../models/tally";
import { WarehouseItem } from "../models/warehouse";

class TallyService {
  async getAllEntries(): Promise<ITallyEntry[]> {
    return await TallyEntry.find().sort({ date: -1 });
  }

  async getEntryById(id: string): Promise<ITallyEntry | null> {
    return await TallyEntry.findById(id);
  }

  async createEntry(data: Partial<ITallyEntry>): Promise<ITallyEntry> {
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

    const entry = new TallyEntry(data);
    return await entry.save();
  }

  async updateEntry(id: string, data: Partial<ITallyEntry>): Promise<ITallyEntry | null> {
    const oldEntry = await TallyEntry.findById(id);
    
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

    return await TallyEntry.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteEntry(id: string): Promise<boolean> {
    const entry = await TallyEntry.findById(id);
    if (entry && entry.usedParts && entry.usedParts.length > 0) {
      await this.restoreWarehouseStock(entry.usedParts);
    }
    const result = await TallyEntry.findByIdAndDelete(id);
    return !!result;
  }

  private async reduceWarehouseStock(usedParts: any[]) {
    for (const part of usedParts) {
      const item = await WarehouseItem.findOne({ name: part.partName });
      if (item) {
        item.currentStock = Math.max(0, item.currentStock - part.quantity);
        item.lastUpdated = new Date();
        await item.save();
      }
    }
  }

  private async restoreWarehouseStock(usedParts: any[]) {
    for (const part of usedParts) {
      const item = await WarehouseItem.findOne({ name: part.partName });
      if (item) {
        item.currentStock += part.quantity;
        item.lastUpdated = new Date();
        await item.save();
      }
    }
  }
}

export const tallyService = new TallyService();

