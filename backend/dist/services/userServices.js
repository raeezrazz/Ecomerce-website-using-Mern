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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const refreshToken_1 = require("../models/refreshToken");
const jwt_1 = require("../utils/jwt");
const conflictErrors_1 = require("../errors/conflictErrors");
class UserService {
    async registerUser(userData) {
        // Normalize email
        const normalizedEmail = userData.email.trim().toLowerCase();
        const existingUser = await user_1.User.findOne({ email: normalizedEmail });
        if (existingUser) {
            throw new conflictErrors_1.ConflictError("This email address is already registered. Please use a different email or try logging in instead.");
        }
        // Validate password strength
        if (userData.password.length < 6) {
            throw new conflictErrors_1.ConflictError("Password must be at least 6 characters long");
        }
        if (userData.password.length > 50) {
            throw new conflictErrors_1.ConflictError("Password must be less than 50 characters");
        }
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        const user = await user_1.User.create({
            ...userData,
            password: hashedPassword,
            isVerified: true, // Set to true after OTP verification
        });
        const userId = user._id.toString();
        const accessToken = (0, jwt_1.generateAccessToken)(userId, user.role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(userId, user.role);
        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
        await refreshToken_1.RefreshToken.create({
            userId,
            token: refreshToken,
            expiresAt,
        });
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    async userLogin(userData) {
        // Normalize email
        const normalizedEmail = userData.email.trim().toLowerCase();
        const user = await user_1.User.findOne({ email: normalizedEmail });
        if (!user) {
            throw new conflictErrors_1.UnauthorizedError("No account found with this email address. Please check your email or sign up.");
        }
        // Check if user is verified
        if (!user.isVerified) {
            throw new conflictErrors_1.UnauthorizedError("Your email is not verified. Please verify your email address before logging in. Check your inbox for the verification code.");
        }
        const isPasswordValid = await bcrypt_1.default.compare(userData.password, user.password);
        if (!isPasswordValid) {
            throw new conflictErrors_1.UnauthorizedError("Incorrect password. Please try again or use 'Forgot Password' if you've forgotten it.");
        }
        const userId = user._id.toString();
        const accessToken = (0, jwt_1.generateAccessToken)(userId, user.role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(userId, user.role);
        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
        // Delete old refresh tokens for this user (optional: keep only latest N tokens)
        await refreshToken_1.RefreshToken.deleteMany({ userId });
        await refreshToken_1.RefreshToken.create({
            userId,
            token: refreshToken,
            expiresAt,
        });
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    async refreshAccessToken(refreshToken) {
        const { verifyRefreshToken } = await Promise.resolve().then(() => __importStar(require("../utils/jwt")));
        // Verify the refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        }
        catch (error) {
            throw new conflictErrors_1.UnauthorizedError("Invalid or expired refresh token");
        }
        // Check if token exists in database
        const storedToken = await refreshToken_1.RefreshToken.findOne({
            userId: decoded.userId,
            token: refreshToken,
        });
        if (!storedToken) {
            throw new conflictErrors_1.UnauthorizedError("Refresh token not found or has been revoked");
        }
        // Check if token has expired (database level check)
        if (storedToken.expiresAt < new Date()) {
            await refreshToken_1.RefreshToken.deleteOne({ _id: storedToken._id });
            throw new conflictErrors_1.UnauthorizedError("Refresh token has expired");
        }
        // Verify user still exists
        const user = await user_1.User.findById(decoded.userId);
        if (!user) {
            await refreshToken_1.RefreshToken.deleteOne({ _id: storedToken._id });
            throw new conflictErrors_1.NotFoundError("User not found");
        }
        // Generate new access token
        const newAccessToken = (0, jwt_1.generateAccessToken)(decoded.userId);
        return {
            accessToken: newAccessToken,
            refreshToken, // Return same refresh token (or generate new one if implementing rotation)
        };
    }
    async logout(userId, refreshToken) {
        if (refreshToken) {
            // Delete specific refresh token
            await refreshToken_1.RefreshToken.deleteOne({ userId, token: refreshToken });
        }
        else {
            // Delete all refresh tokens for this user
            await refreshToken_1.RefreshToken.deleteMany({ userId });
        }
    }
    async userExists(email) {
        return !!(await user_1.User.findOne({ email }));
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
