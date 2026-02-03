"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAccessTokenData = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Access token expires in 15 minutes
const ACCESS_TOKEN_EXPIRY = "15m";
// Refresh token expires in 7 days
const REFRESH_TOKEN_EXPIRY = "7d";
const generateAccessToken = (userId, role) => {
    const payload = { userId, role };
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRY });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId, role) => {
    const payload = { userId, role };
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRY });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Access token has expired");
        }
        else if (error.name === "JsonWebTokenError") {
            throw new Error("Invalid access token");
        }
        throw new Error("Token verification failed");
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Refresh token has expired");
        }
        else if (error.name === "JsonWebTokenError") {
            throw new Error("Invalid refresh token");
        }
        throw new Error("Token verification failed");
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const decodeAccessTokenData = (token) => {
    return (0, exports.verifyAccessToken)(token);
};
exports.decodeAccessTokenData = decodeAccessTokenData;
