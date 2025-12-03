// src/controllers/adminController.ts
import { Request, Response } from "express";
import { adminService } from "../services/adminService";

export const adminController = {

    async login(req: Request, res: Response) {
        try {
          const { email, password } = req.body;
        console.log(req.body)
          if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
          }
    
          const { token, user } = await adminService.loginAdmin(email, password);
    
          return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
          });
    
        } catch (err: any) {
          return res.status(401).json({ success: false, error: err.message });
        }
      },
    
};
