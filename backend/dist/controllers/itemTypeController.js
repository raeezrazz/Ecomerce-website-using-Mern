"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemTypeController = void 0;
const itemTypeService_1 = require("../services/itemTypeService");
exports.itemTypeController = {
    async getAll(req, res) {
        try {
            const itemTypes = await itemTypeService_1.itemTypeService.getAllItemTypes();
            res.json(itemTypes.map(item => ({
                id: item._id.toString(),
                name: item.name,
            })));
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async search(req, res) {
        try {
            const { q } = req.query;
            const query = typeof q === 'string' ? q : '';
            const itemTypes = await itemTypeService_1.itemTypeService.searchItemTypes(query);
            res.json(itemTypes.map(item => ({
                id: item._id.toString(),
                name: item.name,
            })));
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async create(req, res) {
        try {
            const { name } = req.body;
            if (!name || !name.trim()) {
                return res.status(400).json({ error: "Item type name is required" });
            }
            const itemType = await itemTypeService_1.itemTypeService.createItemType(name);
            res.status(201).json({
                id: itemType._id.toString(),
                name: itemType.name,
            });
        }
        catch (error) {
            if (error.message === "Item type already exists") {
                return res.status(409).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        }
    },
    async delete(req, res) {
        try {
            const deleted = await itemTypeService_1.itemTypeService.deleteItemType(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Item type not found" });
            }
            res.json({ message: "Item type deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
