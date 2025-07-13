// src/services/userServices.ts
import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { IUserRepository } from '../repositories/userRepository';
import { TYPES } from '../types/types';
import { ConflictError } from '../errors/conflictErrors';
import { IUser,User } from '../models/user';

export interface IUserService {
  registerUser(name: string, email: string, phone: string, password: string): Promise<Omit<IUser, 'password'>>;
  userExists(email: string): Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async registerUser(name: string, email: string, phone: string, password: string): Promise<Omit<IUser, 'password'>> {
    if (await this.userRepository.findByEmail(email)) {
      throw new ConflictError('Email already registered');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.createUser({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }
}