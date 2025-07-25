import { CreateUserDTO } from './../dtos/CreateUserDTO';
import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { IUserRepository } from '../repositories/userRepository';
import { TYPES } from '../types/types';
import { ConflictError } from '../errors/conflictErrors';
import { IUser,User } from '../models/user';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { strict } from 'assert';
import { UserLoginDTO } from '../dtos/UserLoginDTO';

export interface IUserService {
  registerUser(userData:CreateUserDTO): Promise<{user:Omit<IUser, 'password'>;accessToken:string;refreshToken:string}>;
  userExists(email: string): Promise<boolean>;
  userLogin(userData:UserLoginDTO ):Promise<{user:Omit<IUser, 'password'>;accessToken:string;refreshToken:string}>;
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

    // src/services/userServices.ts

async userLogin(userData: UserLoginDTO): Promise<{
  user: Omit<IUser, 'password'>;
  accessToken: string;
  refreshToken: string;
}> {
  const user = await this.userRepository.findByEmail(userData.email);

  if (!user) {
    throw new ConflictError('User not found with this email');
  }

  const isPasswordValid = await bcrypt.compare(userData.password, user.password);
  if (!isPasswordValid) {
    throw new ConflictError('Invalid Email or Password');
  }

  const userId = user._id.toString();

  const accessToken = generateAccessToken(userId);  
  const refreshToken = generateRefreshToken(userId);

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}



  async userExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }
}