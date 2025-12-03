import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`📩 [${req.method}] ${req.originalUrl}`);
  console.log(`📍 Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
  }
  next();
};
