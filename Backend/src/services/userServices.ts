import { CreateUserDTO } from './../dtos/CreateUserDTO';
import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { IUserRepository } from '../repositories/userRepository';
import { TYPES } from '../types/types';
import { ConflictError } from '../errors/conflictErrors';
import { IUser,User } from '../models/user';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { strict } from 'assert';

export interface IUserService {
  registerUser(userData:CreateUserDTO): Promise<{user:Omit<IUser, 'password'>;accessToken:string;refreshToken:string}>;
  userExists(email: string): Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async registerUser(userData:CreateUserDTO): Promise<{user:Omit<IUser, 'password'>;accessToken:string;refreshToken:string}> {
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password= hashedPassword
    const user = await this.userRepository.createUser(userData);

    const userId:string=user._id.toString()

    //Generating Tokens

    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)

    const { password: _, ...userWithoutPassword } = user;
    return {
      user:userWithoutPassword,accessToken,refreshToken
    };
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }
}