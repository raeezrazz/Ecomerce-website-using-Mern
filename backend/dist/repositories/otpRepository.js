"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
// src/repositories/otpRepositoryImpl.ts
const otp_1 = __importDefault(require("../models/otp"));
const inversify_1 = require("inversify");
let OtpRepository = class OtpRepository {
    async saveOrUpdateOtp(email, otp) {
        await otp_1.default.findOneAndUpdate({ email }, { otp }, { upsert: true });
    }
    async getOtpByEmail(email) {
        const record = await otp_1.default.findOne({ email });
        if (!record || !record?.otp)
            return null;
        return { otp: record.otp };
    }
};
exports.OtpRepository = OtpRepository;
exports.OtpRepository = OtpRepository = __decorate([
    (0, inversify_1.injectable)()
], OtpRepository);
