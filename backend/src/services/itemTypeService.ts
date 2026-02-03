import { ItemType, IItemType } from "../models/itemType";

class ItemTypeService {
  async getAllItemTypes(): Promise<IItemType[]> {
    return await ItemType.find().sort({ name: 1 });
  }

  async searchItemTypes(query: string): Promise<IItemType[]> {
    if (!query || query.trim().length === 0) {
      return await this.getAllItemTypes();
    }
    
    const searchRegex = new RegExp(query.trim(), 'i');
    return await ItemType.find({ name: searchRegex })
      .sort({ name: 1 })
      .limit(10);
  }

  async createItemType(name: string): Promise<IItemType> {
    const normalizedName = name.trim().toLowerCase();
    
    // Check if item type already exists
    const existing = await ItemType.findOne({ name: normalizedName });
    if (existing) {
      throw new Error("Item type already exists");
    }

    const itemType = new ItemType({ name: normalizedName });
    return await itemType.save();
  }

  async deleteItemType(id: string): Promise<boolean> {
    const result = await ItemType.findByIdAndDelete(id);
    return !!result;
  }
}

export const itemTypeService = new ItemTypeService();

