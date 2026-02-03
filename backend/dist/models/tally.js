"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TallyEntry = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UsedPartSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    partName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    rate: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
});
const TallyEntrySchema = new mongoose_1.Schema({
    date: { type: Date, required: true, default: Date.now },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    itemType: { type: String, required: true },
    serviceType: {
        type: String,
        enum: ['repair', 'sale'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'delivered'],
        default: 'pending'
    },
    serviceCharge: { type: Number, required: true, min: 0 },
    partsCost: { type: Number, default: 0, min: 0 },
    usedParts: { type: [UsedPartSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid', 'partial'],
        default: 'unpaid'
    },
    dateCompleted: { type: Date },
    notes: { type: String, default: '' },
    photos: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
TallyEntrySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.TallyEntry = mongoose_1.default.model("TallyEntry", TallyEntrySchema);
