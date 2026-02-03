"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpSchema = void 0;
// src/dto/VerifyOtpDTO.ts
const zod_1 = require("zod");
exports.VerifyOtpSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be less than 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    phone: zod_1.z
        .string({ required_error: "Phone number is required" })
        .min(1, "Phone number is required")
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^\d+$/, "Phone number must contain only digits (0-9)"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long")
        .max(50, "Password must be less than 50 characters"),
    otp: zod_1.z
        .string({ required_error: "OTP is required" })
        .min(1, "OTP is required")
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d+$/, "OTP must contain only digits (0-9)"),
});
