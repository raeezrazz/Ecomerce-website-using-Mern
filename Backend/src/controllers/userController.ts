import { Request, Response } from "express";
import { User } from "../models/user";
import { userService } from "../services/userServices";
import { otpService } from "../services/otpService";
import { CreateUserSchema } from "../dtos/CreateUserDTO";
import { UserLoginSchema } from "../dtos/UserLoginDTO";
import { VerifyOtpSchema } from "../dtos/VerifyOtpDTO";

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      
      // Generate and send OTP
      console.log("1")
      await otpService.generateOtp(validatedData.email);
      
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email. Please verify to complete registration.",
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: error.errors[0]?.message || "Validation error",
        });
      }
      return res.status(400).json({
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
          error: error.errors[0]?.message || "Validation error",
        });
      }
      return res.status(401).json({
        success: false,
        error: error.message || "Login failed",
      });
    }
  },

  async verifyOtpAndRegister(req: Request, res: Response) {
    try {
      const validatedData = VerifyOtpSchema.parse(req.body);
      
      // Verify OTP
      const isOtpValid = await otpService.verifyOtp(validatedData.email, validatedData.otp);
      if (!isOtpValid) {
        return res.status(400).json({
          success: false,
          error: "Invalid or expired OTP",
        });
      }
      
      // Create user
      const { user, accessToken, refreshToken } = await userService.registerUser({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
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
          error: error.errors[0]?.message || "Validation error",
        });
      }
      return res.status(400).json({
        success: false,
        error: error.message || "Registration failed",
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
