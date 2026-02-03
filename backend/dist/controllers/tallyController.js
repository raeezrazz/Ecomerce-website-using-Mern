"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tallyController = void 0;
const tallyService_1 = require("../services/tallyService");
exports.tallyController = {
    async getAll(req, res) {
        try {
            const entries = await tallyService_1.tallyService.getAllEntries();
            res.json(entries);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getById(req, res) {
        try {
            const entry = await tallyService_1.tallyService.getEntryById(req.params.id);
            if (!entry) {
                return res.status(404).json({ error: "Entry not found" });
            }
            res.json(entry);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async create(req, res) {
        try {
            const entry = await tallyService_1.tallyService.createEntry(req.body);
            res.status(201).json(entry);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async update(req, res) {
        try {
            const entry = await tallyService_1.tallyService.updateEntry(req.params.id, req.body);
            if (!entry) {
                return res.status(404).json({ error: "Entry not found" });
            }
            res.json(entry);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async delete(req, res) {
        try {
            const deleted = await tallyService_1.tallyService.deleteEntry(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Entry not found" });
            }
            res.json({ message: "Entry deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
