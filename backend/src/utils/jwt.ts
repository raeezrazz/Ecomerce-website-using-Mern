import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  role?: string; // Include role in token
}

// Access token expires in 15 minutes
const ACCESS_TOKEN_EXPIRY = "15m";
// Refresh token expires in 7 days
const REFRESH_TOKEN_EXPIRY = "7d";

export const generateAccessToken = (userId: string, role?: string): string => {
  const payload: TokenPayload = { userId, role };
  const secret = process.env.JWT_ACCESS_SECRET;
  
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
  }
  
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (userId: string, role?: string): string => {
  const payload: TokenPayload = { userId, role };
  const secret = process.env.JWT_REFRESH_SECRET;
  
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }
  
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;
  
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
  }
  
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Access token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid access token");
    }
    throw new Error("Token verification failed");
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }
  
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token");
    }
    throw new Error("Token verification failed");
  }
};

export const decodeAccessTokenData = (token: string): TokenPayload => {
  return verifyAccessToken(token);
};