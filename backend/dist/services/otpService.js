"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpService = exports.OtpService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_1 = __importDefault(require("../models/otp"));
const generateOtp_1 = require("../utils/generateOtp");
const nodemailer_1 = require("../utils/nodemailer");
const conflictErrors_1 = require("../errors/conflictErrors");
// OTP expires in 5 minutes (300 seconds)
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
// Rate limiting: max 3 OTP requests per email per 15 minutes
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_OTP_REQUESTS = 3;
class OtpService {
    async generateOtp(email) {
        if (!email) {
            throw new conflictErrors_1.ValidationError("Email is required");
        }
        // Check rate limiting
        const recentOtps = await otp_1.default.find({
            email,
            createdAt: { $gte: new Date(Date.now() - RATE_LIMIT_WINDOW) },
        });
        if (recentOtps.length >= MAX_OTP_REQUESTS) {
            throw new conflictErrors_1.ValidationError(`Too many OTP requests. Please wait ${Math.ceil(RATE_LIMIT_WINDOW / 60000)} minutes before requesting again.`);
        }
        const otp = (0, generateOtp_1.generateOtp)(6);
        const hashedOtp = await bcrypt_1.default.hash(otp, 10);
        // Store or update OTP with expiration
        await otp_1.default.findOneAndUpdate({ email }, {
            otp: hashedOtp,
            createdAt: new Date(),
        }, { upsert: true, new: true });
        // Send OTP Email
        try {
            await (0, nodemailer_1.sendEmail)(email, "Verify Your Email", "otpTemplate.html", { OTP: otp });
            console.log(`OTP sent to ${email}`);
        }
        catch (error) {
            // If email fails, delete the OTP record
            await otp_1.default.deleteOne({ email });
            throw new Error(`Failed to send OTP email: ${error.message}`);
        }
    }
    async verifyOtp(email, inputOtp) {
        if (!email || !inputOtp) {
            return false;
        }
        const record = await otp_1.default.findOne({ email });
        if (!record || !record.otp) {
            return false;
        }
        // Check if OTP has expired
        const now = new Date();
        const otpAge = now.getTime() - record.createdAt.getTime();
        if (otpAge > OTP_EXPIRY_TIME) {
            // Delete expired OTP
            await otp_1.default.deleteOne({ email });
            return false;
        }
        const isMatch = await bcrypt_1.default.compare(inputOtp, record.otp);
        if (isMatch) {
            // Delete OTP after successful verification to prevent reuse
            await otp_1.default.deleteOne({ email });
        }
        return isMatch;
    }
    async resendOtp(email) {
        if (!email) {
            throw new conflictErrors_1.ValidationError("Email is required");
        }
        // Delete any existing OTP for this email before generating a new one
        await otp_1.default.deleteOne({ email });
        // Generate and send new OTP
        await this.generateOtp(email);
    }
}
exports.OtpService = OtpService;
// Export instance for backward compatibility
exports.otpService = new OtpService();
