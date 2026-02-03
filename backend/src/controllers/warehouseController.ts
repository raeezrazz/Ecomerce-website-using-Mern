import { Request, Response } from "express";
import { warehouseService } from "../services/warehouseService";

// Helper function to transform warehouse item data for frontend
const transformWarehouseItem = (item: any) => {
  if (!item) return null;
  
  return {
    id: item._id?.toString() || item.id,
    name: item.name || '',
    sku: item.sku || '',
    category: item.category || '',
    currentStock: item.currentStock || 0,
    unit: item.unit || 'pcs',
    costPrice: item.costPrice || 0,
    sellingPrice: item.sellingPrice || 0,
    location: item.location || '',
    minStockLevel: item.minStockLevel || 10,
    lastUpdated: item.lastUpdated ? new Date(item.lastUpdated).toISOString() : new Date().toISOString(),
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
  };
};

export const warehouseController = {
  async getAll(req: Request, res: Response) {
    try {
      const items = await warehouseService.getAllItems();
      const transformedItems = items.map(transformWarehouseItem);
      res.json(transformedItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const item = await warehouseService.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(transformWarehouseItem(item));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      console.log('========================================');
      console.log('📦 CREATING WAREHOUSE ITEM');
      console.log('========================================');
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
      console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
      
      // Validate required fields first
      const { name, sku, category, currentStock, unit, costPrice, sellingPrice, location } = req.body;
      
      console.log('Parsed Fields:');
      console.log('  - name:', name, typeof name);
      console.log('  - sku:', sku, typeof sku);
      console.log('  - category:', category, typeof category);
      console.log('  - currentStock:', currentStock, typeof currentStock);
      console.log('  - unit:', unit, typeof unit);
      console.log('  - costPrice:', costPrice, typeof costPrice);
      console.log('  - sellingPrice:', sellingPrice, typeof sellingPrice);
      console.log('  - location:', location, typeof location);
      
      // Basic validation
      const validationErrors: string[] = [];
      
      if (!name || typeof name !== 'string' || !name.trim()) {
        validationErrors.push('Item name is required and must be a non-empty string');
      }
      if (!sku || typeof sku !== 'string' || !sku.trim()) {
        validationErrors.push('SKU is required and must be a non-empty string');
      }
      if (!category || typeof category !== 'string' || !category.trim()) {
        validationErrors.push('Category is required and must be a non-empty string');
      }
      if (currentStock === undefined || currentStock === null) {
        validationErrors.push('Current stock is required');
      } else if (isNaN(Number(currentStock)) || Number(currentStock) < 0) {
        validationErrors.push(`Current stock must be a valid non-negative number. Received: ${currentStock} (${typeof currentStock})`);
      }
      if (!unit || typeof unit !== 'string' || !unit.trim()) {
        validationErrors.push('Unit is required and must be a non-empty string');
      }
      if (costPrice === undefined || costPrice === null) {
        validationErrors.push('Cost price is required');
      } else if (isNaN(Number(costPrice)) || Number(costPrice) < 0) {
        validationErrors.push(`Cost price must be a valid non-negative number. Received: ${costPrice} (${typeof costPrice})`);
      }
      if (sellingPrice === undefined || sellingPrice === null) {
        validationErrors.push('Selling price is required');
      } else if (isNaN(Number(sellingPrice)) || Number(sellingPrice) < 0) {
        validationErrors.push(`Selling price must be a valid non-negative number. Received: ${sellingPrice} (${typeof sellingPrice})`);
      }
      
      if (validationErrors.length > 0) {
        console.error('❌ VALIDATION ERRORS:', validationErrors);
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationErrors,
          receivedData: req.body
        });
      }
      
      console.log('✅ Basic validation passed, calling service layer...');
      
      // The service layer will handle validation and data transformation
      const item = await warehouseService.createItem(req.body);
      
      console.log('✅ Warehouse item created successfully!');
      console.log('   Item ID:', item._id);
      console.log('   Item Name:', item.name);
      console.log('========================================');
      
      res.status(201).json(transformWarehouseItem(item));
    } catch (error: any) {
      console.error('========================================');
      console.error('❌ WAREHOUSE CREATE ERROR');
      console.error('========================================');
      console.error('Error Type:', error.constructor.name);
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Code:', error.code);
      console.error('Error Stack:', error.stack);
      
      if (error.errors) {
        console.error('Validation Errors:');
        Object.keys(error.errors).forEach(key => {
          console.error(`  - ${key}:`, error.errors[key].message);
        });
      }
      
      if (error.keyPattern) {
        console.error('Duplicate Key Pattern:', error.keyPattern);
      }
      
      if (error.keyValue) {
        console.error('Duplicate Key Value:', error.keyValue);
      }
      
      console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error('========================================');
      
      // Handle duplicate SKU error (MongoDB duplicate key error)
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || 'field';
        const value = error.keyValue?.[field] || 'unknown';
        return res.status(409).json({ 
          error: `${field === 'sku' ? 'SKU' : field} "${value}" already exists. Please use a unique value.`,
          code: 'DUPLICATE_KEY',
          field: field,
          value: value
        });
      }
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errorDetails: Record<string, string> = {};
        if (error.errors) {
          Object.keys(error.errors).forEach(key => {
            errorDetails[key] = error.errors[key].message;
          });
        }
        const messages = Object.values(errorDetails).join(', ');
        return res.status(400).json({ 
          error: 'Validation failed',
          details: errorDetails,
          message: messages || 'Validation failed'
        });
      }
      
      // Handle CastError (invalid ObjectId, etc.)
      if (error.name === 'CastError') {
        return res.status(400).json({ 
          error: `Invalid ${error.kind || 'value'} for field ${error.path || 'unknown'}`,
          received: error.value,
          code: 'CAST_ERROR'
        });
      }
      
      // Return the error message from service layer
      res.status(400).json({ 
        error: error.message || 'Failed to create warehouse item',
        type: error.name || 'UnknownError',
        code: error.code || 'UNKNOWN_ERROR'
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      console.log('========================================');
      console.log('📝 UPDATING WAREHOUSE ITEM');
      console.log('========================================');
      console.log('Item ID:', req.params.id);
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
      
      const item = await warehouseService.updateItem(req.params.id, req.body);
      if (!item) {
        console.error('❌ Item not found with ID:', req.params.id);
        return res.status(404).json({ error: "Item not found", itemId: req.params.id });
      }
      
      console.log('✅ Warehouse item updated successfully!');
      console.log('   Updated Item ID:', item._id);
      console.log('========================================');
      
      res.json(transformWarehouseItem(item));
    } catch (error: any) {
      console.error('========================================');
      console.error('❌ WAREHOUSE UPDATE ERROR');
      console.error('========================================');
      console.error('Item ID:', req.params.id);
      console.error('Error Type:', error.constructor.name);
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Code:', error.code);
      console.error('Error Stack:', error.stack);
      
      if (error.errors) {
        console.error('Validation Errors:');
        Object.keys(error.errors).forEach(key => {
          console.error(`  - ${key}:`, error.errors[key].message);
        });
      }
      console.error('========================================');
      
      // Handle duplicate SKU error
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0] || 'field';
        const value = error.keyValue?.[field] || 'unknown';
        return res.status(409).json({ 
          error: `${field === 'sku' ? 'SKU' : field} "${value}" already exists. Please use a unique value.`,
          code: 'DUPLICATE_KEY',
          field: field,
          value: value
        });
      }
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errorDetails: Record<string, string> = {};
        if (error.errors) {
          Object.keys(error.errors).forEach(key => {
            errorDetails[key] = error.errors[key].message;
          });
        }
        const messages = Object.values(errorDetails).join(', ');
        return res.status(400).json({ 
          error: 'Validation failed',
          details: errorDetails,
          message: messages || 'Validation failed'
        });
      }
      
      // Handle CastError (invalid ObjectId)
      if (error.name === 'CastError') {
        return res.status(400).json({ 
          error: `Invalid ${error.kind || 'value'} for field ${error.path || 'unknown'}`,
          received: error.value,
          code: 'CAST_ERROR',
          itemId: req.params.id
        });
      }
      
      res.status(400).json({ 
        error: error.message || 'Failed to update warehouse item',
        type: error.name || 'UnknownError',
        code: error.code || 'UNKNOWN_ERROR',
        itemId: req.params.id
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const deleted = await warehouseService.deleteItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLowStock(req: Request, res: Response) {
    try {
      const items = await warehouseService.getLowStockItems();
      const transformedItems = items.map(transformWarehouseItem);
      res.json(transformedItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

