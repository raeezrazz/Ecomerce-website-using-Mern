"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthController = void 0;
// Google OAuth is disabled - uncomment imports and configure GOOGLE_CLIENT_ID to enable
// import { OAuth2Client } from "google-auth-library";
// import { User } from "../models/user";
// import { RefreshToken } from "../models/refreshToken";
// import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleAuthController = {
    async verifyGoogleToken(req, res) {
        // Dummy implementation - Google OAuth not configured
        return res.status(501).json({
            success: false,
            error: "Google authentication is not configured. Please configure GOOGLE_CLIENT_ID in environment variables to enable Google login.",
            message: "Google login feature is currently disabled. Please use email/password login or contact administrator.",
        });
        /*
        // Uncomment and configure GOOGLE_CLIENT_ID to enable Google OAuth
        try {
          const { token } = req.body;
    
          if (!token) {
            return res.status(400).json({
              success: false,
              error: "Google token is required",
            });
          }
    
          if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(501).json({
              success: false,
              error: "Google OAuth is not configured",
            });
          }
    
          // Verify the Google token (can be either access_token or id_token)
          let payload: any;
          
          try {
            // Try as ID token first
            const ticket = await client.verifyIdToken({
              idToken: token,
              audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
          } catch (error) {
            // If ID token fails, try to get user info from access token
            try {
              const userInfoResponse = await fetch(
                `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
              );
              
              if (!userInfoResponse.ok) {
                throw new Error("Failed to fetch user info");
              }
              
              const userInfo = await userInfoResponse.json();
              
              if (!userInfo.email) {
                return res.status(400).json({
                  success: false,
                  error: "Email not provided by Google",
                });
              }
    
              payload = {
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                sub: userInfo.id,
              };
            } catch (fetchError: any) {
              return res.status(400).json({
                success: false,
                error: "Invalid Google token: " + (fetchError.message || "Authentication failed"),
              });
            }
          }
    
          if (!payload) {
            return res.status(400).json({
              success: false,
              error: "Invalid Google token",
            });
          }
    
          const { email, name, picture, sub: googleId } = payload;
    
          if (!email) {
            return res.status(400).json({
              success: false,
              error: "Email not provided by Google",
            });
          }
    
          // Check if user exists
          let user = await User.findOne({ email });
    
          if (!user) {
            // Create new user
            user = await User.create({
              name: name || email.split("@")[0],
              email,
              phone: "", // Google doesn't provide phone
              password: "", // No password for OAuth users
              isVerified: true, // Google emails are verified
              isAdmin: false,
            });
          } else {
            // Update user info if needed
            if (!user.name && name) {
              user.name = name;
              await user.save();
            }
          }
    
          const userId = user._id.toString();
          const accessToken = generateAccessToken(userId);
          const refreshToken = generateRefreshToken(userId);
    
          // Store refresh token
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7);
    
          await RefreshToken.deleteMany({ userId });
          await RefreshToken.create({
            userId,
            token: refreshToken,
            expiresAt,
          });
    
          return res.status(200).json({
            success: true,
            message: "Google authentication successful",
            data: {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              phone: user.phone || "",
            },
            accessToken,
            refreshToken,
          });
        } catch (error: any) {
          console.error("Google auth error:", error);
          return res.status(400).json({
            success: false,
            error: error.message || "Google authentication failed",
          });
        }
        */
    },
};
