import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { IUser, User } from './../models/user';
// src/repositories/userRepository.ts
import { injectable } from 'inversify';

export interface IUserRepository {
  createUser(data:CreateUserDTO): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
}

@injectable()
export class UserRepository implements IUserRepository {
  async createUser(data:CreateUserDTO): Promise<IUser> {
    const user = new User(data);
    await user.save();
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).exec();
  }
}