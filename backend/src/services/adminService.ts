// src/services/adminService.ts
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { RefreshToken } from "../models/refreshToken";

class AdminService {

    async loginAdmin(email: string, password: string) {
        const user = await User.findOne({ email });
    
        if (!user) throw new Error("Admin not found");
        if (user.role !== 'admin') throw new Error("Unauthorized: Admin access required");
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Incorrect password");

        const userId = user._id.toString();
        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);

        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        // Delete old refresh tokens for this user
        await RefreshToken.deleteMany({ userId });

        await RefreshToken.create({
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

export const adminService = new AdminService();
