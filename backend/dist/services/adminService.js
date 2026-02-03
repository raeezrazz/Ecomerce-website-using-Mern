"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
// src/services/adminService.ts
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const refreshToken_1 = require("../models/refreshToken");
class AdminService {
    async loginAdmin(email, password) {
        const user = await user_1.User.findOne({ email });
        if (!user)
            throw new Error("Admin not found");
        if (user.role !== 'admin')
            throw new Error("Unauthorized: Admin access required");
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            throw new Error("Incorrect password");
        const userId = user._id.toString();
        const accessToken = (0, jwt_1.generateAccessToken)(userId);
        const refreshToken = (0, jwt_1.generateRefreshToken)(userId);
        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
        // Delete old refresh tokens for this user
        await refreshToken_1.RefreshToken.deleteMany({ userId });
        await refreshToken_1.RefreshToken.create({
            userId,
            token: refreshToken,
            expiresAt,
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
}
exports.adminService = new AdminService();
