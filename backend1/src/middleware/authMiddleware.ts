import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../errors/AppError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
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
      (req as AuthRequest).user = { userId: decoded.userId };
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
