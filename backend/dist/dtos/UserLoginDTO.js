"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginSchema = void 0;
// src/dto/UserLoginDTO.ts
const zod_1 = require("zod");
exports.UserLoginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long"),
});
