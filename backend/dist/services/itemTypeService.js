"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemTypeService = void 0;
const itemType_1 = require("../models/itemType");
class ItemTypeService {
    async getAllItemTypes() {
        return await itemType_1.ItemType.find().sort({ name: 1 });
    }
    async searchItemTypes(query) {
        if (!query || query.trim().length === 0) {
            return await this.getAllItemTypes();
        }
        const searchRegex = new RegExp(query.trim(), 'i');
        return await itemType_1.ItemType.find({ name: searchRegex })
            .sort({ name: 1 })
            .limit(10);
    }
    async createItemType(name) {
        const normalizedName = name.trim().toLowerCase();
        // Check if item type already exists
        const existing = await itemType_1.ItemType.findOne({ name: normalizedName });
        if (existing) {
            throw new Error("Item type already exists");
        }
        const itemType = new itemType_1.ItemType({ name: normalizedName });
        return await itemType.save();
    }
    async deleteItemType(id) {
        const result = await itemType_1.ItemType.findByIdAndDelete(id);
        return !!result;
    }
}
exports.itemTypeService = new ItemTypeService();
