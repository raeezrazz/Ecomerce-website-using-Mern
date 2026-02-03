"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_1 = require("../models/user");
const userServices_1 = require("../services/userServices");
const otpService_1 = require("../services/otpService");
const CreateUserDTO_1 = require("../dtos/CreateUserDTO");
const UserLoginDTO_1 = require("../dtos/UserLoginDTO");
const VerifyOtpDTO_1 = require("../dtos/VerifyOtpDTO");
class UserController {
    async register(req, res) {
        try {
            const validatedData = CreateUserDTO_1.CreateUserSchema.parse(req.body);
            // Normalize email
            const normalizedEmail = validatedData.email.trim().toLowerCase();
            // Check if user already exists
            const existingUser = await userServices_1.userService.userExists(normalizedEmail);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: "This email address is already registered. Please use a different email or try logging in instead.",
                });
            }
            // Generate and send OTP
            await otpService_1.otpService.generateOtp(normalizedEmail);
            return res.status(200).json({
                success: true,
                message: "OTP sent to your email. Please verify to complete registration.",
            });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    success: false,
                    error: error.errors.map((e) => e.message).join(", ") || "Validation error",
                });
            }
            const statusCode = error.statusCode || 400;
            return res.status(statusCode).json({
                success: false,
                error: error.message || "Registration failed",
            });
        }
    }
    async login(req, res) {
        try {
            const validatedData = UserLoginDTO_1.UserLoginSchema.parse(req.body);
            const { user, accessToken, refreshToken } = await userServices_1.userService.userLogin(validatedData);
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role || 'user',
                },
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    success: false,
                    error: error.errors.map((e) => e.message).join(", ") || "Validation error",
                });
            }
            const statusCode = error.statusCode || 401;
            return res.status(statusCode).json({
                success: false,
                error: error.message || "Login failed",
            });
        }
    }
    async verifyOtpAndRegister(req, res) {
        try {
            const validatedData = VerifyOtpDTO_1.VerifyOtpSchema.parse(req.body);
            // Normalize email
            const normalizedEmail = validatedData.email.trim().toLowerCase();
            // Verify OTP
            const isOtpValid = await otpService_1.otpService.verifyOtp(normalizedEmail, validatedData.otp);
            if (!isOtpValid) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid or expired OTP. The code you entered is incorrect or has expired. Please request a new OTP.",
                });
            }
            // Check if user already exists (double-check)
            const existingUser = await userServices_1.userService.userExists(normalizedEmail);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: "This email address is already registered. Please use a different email or try logging in instead.",
                });
            }
            // Create user
            const { user, accessToken, refreshToken } = await userServices_1.userService.registerUser({
                name: validatedData.name.trim(),
                email: normalizedEmail,
                phone: validatedData.phone.trim(),
                password: validatedData.password,
            });
            return res.status(201).json({
                success: true,
                message: "Registration successful",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role || 'user',
                },
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    success: false,
                    error: error.errors.map((e) => e.message).join(", ") || "Validation error",
                });
            }
            const statusCode = error.statusCode || 400;
            return res.status(statusCode).json({
                success: false,
                error: error.message || "Registration failed",
            });
        }
    }
    async resendOtp(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    error: "Email is required",
                });
            }
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid email format",
                });
            }
            await otpService_1.otpService.resendOtp(email);
            return res.status(200).json({
                success: true,
                message: "OTP resent to your email. Please check your inbox.",
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 400;
            return res.status(statusCode).json({
                success: false,
                error: error.message || "Failed to resend OTP",
            });
        }
    }
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
    }
    async logout(req, res) {
        try {
            const authReq = req;
            const userId = authReq.user?.userId;
            const { refreshToken } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: "User not authenticated",
                });
            }
            await userServices_1.userService.logout(userId, refreshToken);
            return res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                error: error.message || "Logout failed",
            });
        }
    }
    async getProfile(req, res) {
        try {
            const authReq = req;
            const userId = authReq.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: "User not authenticated",
                });
            }
            const user = await user_1.User.findById(userId).select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }
            return res.status(200).json({
                success: true,
                data: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone || '',
                    role: user.role || 'user',
                    address: user.address || '',
                    city: user.city || '',
                    state: user.state || '',
                    pincode: user.pincode || '',
                },
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                error: error.message || "Failed to fetch profile",
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const authReq = req;
            const userId = authReq.user?.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: "User not authenticated",
                });
            }
            const { name, phone, address, city, state, pincode } = req.body;
            const updateData = {};
            if (name)
                updateData.name = name;
            if (phone)
                updateData.phone = phone;
            if (address !== undefined)
                updateData.address = address;
            if (city !== undefined)
                updateData.city = city;
            if (state !== undefined)
                updateData.state = state;
            if (pincode !== undefined)
                updateData.pincode = pincode;
            const user = await user_1.User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone || '',
                    address: user.address || '',
                    city: user.city || '',
                    state: user.state || '',
                    pincode: user.pincode || '',
                },
            });
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                success: false,
                error: error.message || "Failed to update profile",
            });
        }
    }
    async getAll(req, res) {
        try {
            const users = await user_1.User.find({ isVerified: true })
                .select("-password")
                .sort({ createdAt: -1 });
            const transformedUsers = users.map(user => ({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                role: user.role || 'user',
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            }));
            res.json(transformedUsers);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const user = await user_1.User.findById(req.params.id).select("-password");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const { status } = req.body;
            const user = await user_1.User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select("-password");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const user = await user_1.User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.UserController = UserController;
// Export instance for backward compatibility
exports.userController = new UserController();
