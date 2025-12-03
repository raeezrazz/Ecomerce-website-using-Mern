// src/services/adminService.ts
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AdminService {

    async loginAdmin(email: string, password: string) {

        const user = await User.findOne({ email });
    
        if (!user) throw new Error("Admin not found");
        if (!user.isAdmin) throw new Error("Unauthorized: Not an admin");
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Incorrect password");
    
        const token = jwt.sign(
          { id: user._id, isAdmin: true },
          process.env.JWT_SECRET!,
          { expiresIn: "10d" }
        );
    
        return {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        };
      }
}

export const adminService = new AdminService();
