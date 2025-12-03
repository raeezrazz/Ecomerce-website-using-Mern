import { Request, Response } from "express";
import { User } from "../models/user";
import { userService } from "../services/userServices";
import { otpService } from "../services/otpService";
import { CreateUserSchema } from "../dtos/CreateUserDTO";
import { UserLoginSchema } from "../dtos/UserLoginDTO";
import { VerifyOtpSchema } from "../dtos/VerifyOtpDTO";
import { ConflictError, UnauthorizedError, ValidationError, NotFoundError } from "../errors/conflictErrors";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      
      // Normalize email
      const normalizedEmail = validatedData.email.trim().toLowerCase();
      
      // Check if user already exists
      const existingUser = await userService.userExists(normalizedEmail);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "This email address is already registered. Please use a different email or try logging in instead.",
        });
      }
      
      // Generate and send OTP
      await otpService.generateOtp(normalizedEmail);
      
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email. Please verify to complete registration.",
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: error.errors.map((e: any) => e.message).join(", ") || "Validation error",
        });
      }
      
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        error: error.message || "Registration failed",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const validatedData = UserLoginSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await userService.userLogin(validatedData);
      
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: error.errors.map((e: any) => e.message).join(", ") || "Validation error",
        });
      }
      
      const statusCode = error.statusCode || 401;
      return res.status(statusCode).json({
        success: false,
        error: error.message || "Login failed",
      });
    }
  },

  async verifyOtpAndRegister(req: Request, res: Response) {
    try {
      const validatedData = VerifyOtpSchema.parse(req.body);
      
      // Normalize email
      const normalizedEmail = validatedData.email.trim().toLowerCase();
      
      // Verify OTP
      const isOtpValid = await otpService.verifyOtp(normalizedEmail, validatedData.otp);
      if (!isOtpValid) {
        return res.status(400).json({
          success: false,
          error: "Invalid or expired OTP. The code you entered is incorrect or has expired. Please request a new OTP.",
        });
      }
      
      // Check if user already exists (double-check)
      const existingUser = await userService.userExists(normalizedEmail);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: "This email address is already registered. Please use a different email or try logging in instead.",
        });
      }
      
      // Create user
      const { user, accessToken, refreshToken } = await userService.registerUser({
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
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: error.errors.map((e: any) => e.message).join(", ") || "Validation error",
        });
      }
      
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        error: error.message || "Registration failed",
      });
    }
  },

  async resendOtp(req: Request, res: Response) {
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

      await otpService.resendOtp(email);
      
      return res.status(200).json({
        success: true,
        message: "OTP resent to your email. Please check your inbox.",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        error: error.message || "Failed to resend OTP",
      });
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: "Refresh token is required",
        });
      }

      const { accessToken, refreshToken: newRefreshToken } = await userService.refreshAccessToken(refreshToken);
      
      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 401;
      return res.status(statusCode).json({
        success: false,
        error: error.message || "Failed to refresh token",
      });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;
      const { refreshToken } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      await userService.logout(userId, refreshToken);
      
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        error: error.message || "Logout failed",
      });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      const user = await User.findById(userId).select("-password");
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
          address: (user as any).address || '',
          city: (user as any).city || '',
          state: (user as any).state || '',
          pincode: (user as any).pincode || '',
        },
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        error: error.message || "Failed to fetch profile",
      });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      const { name, phone, address, city, state, pincode } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (city !== undefined) updateData.city = city;
      if (state !== undefined) updateData.state = state;
      if (pincode !== undefined) updateData.pincode = pincode;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select("-password");

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
          address: (user as any).address || '',
          city: (user as any).city || '',
          state: (user as any).state || '',
          pincode: (user as any).pincode || '',
        },
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        error: error.message || "Failed to update profile",
      });
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const users = await User.find({ isVerified: true })
        .select("-password")
        .sort({ createdAt: -1 });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
