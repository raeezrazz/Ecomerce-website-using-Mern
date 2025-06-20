import { UserService } from './../services/userServices';
import { Request, Response } from 'express';
// import { IUserRepository } from '../repositories/userRepository';

import bcrypt from 'bcrypt';



export class UserController {

    private userService:  UserService

    constructor() {
        this.userService = new UserService()
    }
  
   
async register(req: Request, res: Response) {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  try {
      if (await this.userService.userExist(email)) {
          return res.status(409).json({ message: 'Email already in use' });
      }

      const newUser = await this.userService.registerUser(name, email, phone, password);
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
          message: 'User registered successfully',
          user: userWithoutPassword
      });
  } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
}


}