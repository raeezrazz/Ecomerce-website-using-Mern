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
      try {
        const { name, email, password, phone } = req.body;
  
        // Validate input
        if (!name || !email || !password || !phone) {
          return res.status(400).json({ message: 'All fields are required' });
        }
  
        // Check if user exists
        const existingUser = await this.userService.userExist(email);
        if (existingUser) {
          return res.status(409).json({ message: 'Email already in use' });
        }
        console.log("user existing checked")
       
        // Create user
        const newUser = await this.userService.register(
          name,
          email,
          phone,
          password
        )
  
        // Omit password from response
        // const { password: _, ...userWithoutPassword } = newUser;
  
        res.status(201).json({
          message: 'User registered successfully',
        //   user: userWithoutPassword
        });
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }


}