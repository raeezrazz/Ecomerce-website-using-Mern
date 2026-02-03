import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt";
import { AppError } from "../errors/AppError";
import { User } from "../models/user";
import type { UserRole } from "../models/user";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role?: string;
  };
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
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
      const decoded = verifyAccessToken(token);
      
      // Fetch user to get current role (in case role changed after token was issued)
      const user = await User.findById(decoded.userId).select("role");
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not found",
        });
      }

      (req as AuthRequest).user = { 
        userId: decoded.userId,
        role: user.role || decoded.role 
      };
      next();
    } catch (error: any) {
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: "Authentication error",
    });
  }
};

// Middleware to check if user has admin role
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Admin access required",
    });
  }
  next();
};

// Middleware to check if user has staff or admin role
export const staffOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const role = authReq.user?.role;
  if (role !== 'admin' && role !== 'staff') {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Staff or Admin access required",
    });
  }
  next();
};
