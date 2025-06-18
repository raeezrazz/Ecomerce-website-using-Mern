import { inject, injectable } from "tsyringe";
import { UserRepository } from "../repositories/userRepository";
import { User } from "../models/user";
// import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// @injectable()
export class UserService {
    private userRepository: UserRepository

  constructor(
    // @inject(UserRepository) private userRepository: UserRepository
  ) {
    this.userRepository = new UserRepository()
  }

  async register(name: string, email: string,phone:String, password: string): Promise<any> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new Error("Email already registered");

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user= {
      name,
      email,
      phone,
      password
    };

    return this.userRepository.createUser(user);
  }

  
  async userExist(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }
}
