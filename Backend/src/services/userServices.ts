import bcrypt from "bcrypt";
import { User } from "../models/user";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { ConflictError } from "../errors/conflictErrors";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { UserLoginDTO } from "../dtos/UserLoginDTO";

export class UserService {

  async registerUser(userData: CreateUserDTO) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new ConflictError("Email already registered");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const user = await User.create(userData);
    const userId = user._id.toString();

    return {
      user,
      accessToken: generateAccessToken(userId),
      refreshToken: generateRefreshToken(userId),
    };
  }

  async userLogin(userData: UserLoginDTO) {
    const user = await User.findOne({ email: userData.email });

    if (!user) throw new ConflictError("User not found");

    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordValid) throw new ConflictError("Invalid email or password");

    const userId = user._id.toString();

    return {
      user,
      accessToken: generateAccessToken(userId),
      refreshToken: generateRefreshToken(userId),
    };
  }

  async userExists(email: string) {
    return !!(await User.findOne({ email }));
  }
}

export const userService = new UserService();
