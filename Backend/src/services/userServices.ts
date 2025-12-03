import bcrypt from "bcrypt";
import { User } from "../models/user";
import { RefreshToken } from "../models/refreshToken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { ConflictError, UnauthorizedError, NotFoundError } from "../errors/conflictErrors";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { UserLoginDTO } from "../dtos/UserLoginDTO";

export class UserService {
  async registerUser(userData: CreateUserDTO) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    // Validate password strength
    if (userData.password.length < 6) {
      throw new ConflictError("Password must be at least 6 characters long");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      isVerified: true, // Set to true after OTP verification
    });

    const userId = user._id.toString();
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await RefreshToken.create({
      userId,
      token: refreshToken,
      expiresAt,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async userLogin(userData: UserLoginDTO) {
    const user = await User.findOne({ email: userData.email });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new UnauthorizedError("Please verify your email before logging in");
    }

    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const userId = user._id.toString();
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Delete old refresh tokens for this user (optional: keep only latest N tokens)
    await RefreshToken.deleteMany({ userId });

    await RefreshToken.create({
      userId,
      token: refreshToken,
      expiresAt,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const { verifyRefreshToken } = await import("../utils/jwt");

    // Verify the refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error: any) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    // Check if token exists in database
    const storedToken = await RefreshToken.findOne({
      userId: decoded.userId,
      token: refreshToken,
    });

    if (!storedToken) {
      throw new UnauthorizedError("Refresh token not found or has been revoked");
    }

    // Check if token has expired (database level check)
    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      throw new UnauthorizedError("Refresh token has expired");
    }

    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      throw new NotFoundError("User not found");
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.userId);

    return {
      accessToken: newAccessToken,
      refreshToken, // Return same refresh token (or generate new one if implementing rotation)
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // Delete specific refresh token
      await RefreshToken.deleteOne({ userId, token: refreshToken });
    } else {
      // Delete all refresh tokens for this user
      await RefreshToken.deleteMany({ userId });
    }
  }

  async userExists(email: string) {
    return !!(await User.findOne({ email }));
  }
}

export const userService = new UserService();
