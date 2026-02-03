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
    console.log('🔧 Service Layer - Processing warehouse item data');
    console.log('   Input data:', JSON.stringify(data, null, 2));
    
    try {
      // Ensure proper data types and defaults
      const itemData: any = {
        name: typeof data.name === 'string' ? data.name.trim() : String(data.name || '').trim(),
        sku: typeof data.sku === 'string' ? data.sku.trim() : String(data.sku || '').trim(),
        category: typeof data.category === 'string' ? data.category.trim() : String(data.category || '').trim(),
        currentStock: Number(data.currentStock) || 0,
        unit: typeof data.unit === 'string' ? data.unit.trim() : (data.unit || 'pcs'),
        costPrice: Number(data.costPrice) || 0,
        sellingPrice: Number(data.sellingPrice) || 0,
        location: typeof data.location === 'string' ? data.location.trim() : (data.location || 'Main Warehouse'),
        minStockLevel: Number(data.minStockLevel) || 10,
      };

      console.log('   Processed data:', JSON.stringify(itemData, null, 2));

      // Validate required fields
      if (!itemData.name || itemData.name.length === 0) {
        throw new Error('Item name is required and cannot be empty');
      }
      if (!itemData.sku || itemData.sku.length === 0) {
        throw new Error('SKU is required and cannot be empty');
      }
      if (!itemData.category || itemData.category.length === 0) {
        throw new Error('Category is required and cannot be empty');
      }
      if (isNaN(itemData.currentStock) || itemData.currentStock < 0) {
        throw new Error(`Current stock must be a valid non-negative number. Got: ${data.currentStock} (${typeof data.currentStock})`);
      }
      if (isNaN(itemData.costPrice) || itemData.costPrice < 0) {
        throw new Error(`Cost price must be a valid non-negative number. Got: ${data.costPrice} (${typeof data.costPrice})`);
      }
      if (isNaN(itemData.sellingPrice) || itemData.sellingPrice < 0) {
        throw new Error(`Selling price must be a valid non-negative number. Got: ${data.sellingPrice} (${typeof data.sellingPrice})`);
      }
      if (!itemData.unit || itemData.unit.length === 0) {
        throw new Error('Unit is required and cannot be empty');
      }

      console.log('   ✅ Validation passed, creating MongoDB document...');
      
      const item = new WarehouseItem(itemData);
      console.log('   Document created, saving to database...');
      
      const savedItem = await item.save();
      console.log('   ✅ Item saved successfully with ID:', savedItem._id);
      
      return savedItem;
    } catch (error: any) {
      console.error('   ❌ Service Layer Error:', error.message);
      console.error('   Error Type:', error.constructor.name);
      console.error('   Error Name:', error.name);
      if (error.errors) {
        console.error('   Validation Errors:', error.errors);
      }
      throw error; // Re-throw to let controller handle it
    }
  }

  async updateItem(id: string, data: Partial<IWarehouseItem>): Promise<IWarehouseItem | null> {
    // Ensure proper data types
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.sku !== undefined) updateData.sku = data.sku.trim();
    if (data.category !== undefined) updateData.category = data.category.trim();
    if (data.currentStock !== undefined) updateData.currentStock = Number(data.currentStock);
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.costPrice !== undefined) updateData.costPrice = Number(data.costPrice);
    if (data.sellingPrice !== undefined) updateData.sellingPrice = Number(data.sellingPrice);
    if (data.location !== undefined) updateData.location = data.location.trim() || 'Main Warehouse';
    if (data.minStockLevel !== undefined) updateData.minStockLevel = Number(data.minStockLevel);

    // Validate numeric fields
    if (updateData.currentStock !== undefined && (isNaN(updateData.currentStock) || updateData.currentStock < 0)) {
      throw new Error('Current stock must be a valid non-negative number');
    }
    if (updateData.costPrice !== undefined && (isNaN(updateData.costPrice) || updateData.costPrice < 0)) {
      throw new Error('Cost price must be a valid non-negative number');
    }
    if (updateData.sellingPrice !== undefined && (isNaN(updateData.sellingPrice) || updateData.sellingPrice < 0)) {
      throw new Error('Selling price must be a valid non-negative number');
    }

    return await WarehouseItem.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
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

