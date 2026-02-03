// src/controllers/adminController.ts
import { Request, Response } from "express";
import { adminService } from "../services/adminService";
import { userService } from "../services/userServices";
import { AuthRequest } from "../middleware/authMiddleware";

export const adminController = {

    async login(req: Request, res: Response) {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
          }
    
          const { accessToken, refreshToken, user } = await adminService.loginAdmin(email, password);
    
          return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
            refreshToken,
            user
          });
    
        } catch (err: any) {
          return res.status(401).json({ success: false, error: err.message });
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
    
};
