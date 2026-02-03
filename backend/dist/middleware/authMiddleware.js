"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffOrAdmin = exports.adminOnly = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const user_1 = require("../models/user");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Authorization header missing or invalid. Please provide a valid Bearer token.",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Token not provided",
            });
        }
        try {
            const decoded = (0, jwt_1.verifyAccessToken)(token);
            // Fetch user to get current role (in case role changed after token was issued)
            const user = await user_1.User.findById(decoded.userId).select("role");
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: "User not found",
                });
            }
            req.user = {
                userId: decoded.userId,
                role: user.role || decoded.role
            };
            next();
        }
        catch (error) {
            if (error.message.includes("expired")) {
                return res.status(401).json({
                    success: false,
                    error: "Access token has expired. Please refresh your token.",
                });
            }
            return res.status(401).json({
                success: false,
                error: "Invalid or malformed token",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: "Authentication error",
        });
    }
};
exports.authenticateToken = authenticateToken;
// Middleware to check if user has admin role
const adminOnly = (req, res, next) => {
    const authReq = req;
    if (authReq.user?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: "Forbidden: Admin access required",
        });
    }
    next();
};
exports.adminOnly = adminOnly;
// Middleware to check if user has staff or admin role
const staffOrAdmin = (req, res, next) => {
    const authReq = req;
    const role = authReq.user?.role;
    if (role !== 'admin' && role !== 'staff') {
        return res.status(403).json({
            success: false,
            error: "Forbidden: Staff or Admin access required",
        });
    }
    next();
};
exports.staffOrAdmin = staffOrAdmin;
