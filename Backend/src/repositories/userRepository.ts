// src/repositories/userRepository.ts
import { injectable } from 'inversify';
import { User } from '../models/user';

export interface IUserRepository {
  createUser(data: Omit<User, '_id'>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

@injectable()
export class UserRepository implements IUserRepository {
  async createUser(data: Omit<User, '_id'>): Promise<User> {
    const user = new User(data);
    await user.save();
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ email }).exec();
  }
}