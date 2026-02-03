"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const adminService_1 = require("../services/adminService");
const userServices_1 = require("../services/userServices");
exports.adminController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, error: "Email and password are required" });
            }
            const { accessToken, refreshToken, user } = await adminService_1.adminService.loginAdmin(email, password);
            return res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken,
                refreshToken,
                user
            });
        }
        catch (err) {
            return res.status(401).json({ success: false, error: err.message });
        }
    },
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    error: "Refresh token is required",
                });
            }
            const { accessToken, refreshToken: newRefreshToken } = await userServices_1.userService.refreshAccessToken(refreshToken);
            return res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                accessToken,
                refreshToken: newRefreshToken,
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 401;
            return res.status(statusCode).json({
                success: false,
                error: error.message || "Failed to refresh token",
            });
        }
    },
};
