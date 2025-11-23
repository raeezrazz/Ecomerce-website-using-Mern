import { WarehouseItem, IWarehouseItem } from "../models/warehouse";

class WarehouseService {
  async getAllItems(): Promise<IWarehouseItem[]> {
    return await WarehouseItem.find().sort({ name: 1 });
  }

  async getItemById(id: string): Promise<IWarehouseItem | null> {
    return await WarehouseItem.findById(id);
  }

  async getItemByName(name: string): Promise<IWarehouseItem | null> {
    return await WarehouseItem.findOne({ name });
  }

  async createItem(data: Partial<IWarehouseItem>): Promise<IWarehouseItem> {
    const item = new WarehouseItem(data);
    return await item.save();
  }

  async updateItem(id: string, data: Partial<IWarehouseItem>): Promise<IWarehouseItem | null> {
    return await WarehouseItem.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteItem(id: string): Promise<boolean> {
    const result = await WarehouseItem.findByIdAndDelete(id);
    return !!result;
  }

  async updateStock(id: string, quantity: number): Promise<IWarehouseItem | null> {
    const item = await WarehouseItem.findById(id);
    if (item) {
      item.currentStock = Math.max(0, item.currentStock + quantity);
      item.lastUpdated = new Date();
      return await item.save();
    }
    return null;
  }

  async getLowStockItems(): Promise<IWarehouseItem[]> {
    return await WarehouseItem.find({
      $expr: { $lte: ["$currentStock", "$minStockLevel"] }
    });
  }
}

export const warehouseService = new WarehouseService();

