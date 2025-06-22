// src/controllers/userController.ts
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { IUserService } from '../services/userServices';
import { TYPES } from '../types/types';
import { ConflictError } from '../errors/conflictErrors';

export interface IUserController {
  register(req: Request, res: Response): Promise<void>;
}

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService
  ) {}

  async register(req: Request, res: Response) {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      if (await this.userService.userExists(email)) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      const newUser = await this.userService.registerUser(name, email, phone, password);
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}