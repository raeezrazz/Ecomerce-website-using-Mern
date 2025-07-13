// src/controllers/userController.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../services/userServices';
import { TYPES } from '../types/types';
import { ConflictError } from '../errors/conflictErrors';
import { CreateUserDTO, CreateUserSchema } from '../dto/CreateUserDTO';

export interface IUserController {
  register(req: Request, res: Response): Promise<void>;
}

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private readonly userService: IUserService
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const parsed = CreateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }

      const userData: CreateUserDTO = parsed.data;

      const exists = await this.userService.userExists(userData.email);
      if (exists) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      const newUser = await this.userService.registerUser(userData);

      const { password: _, ...userWithoutPassword } = newUser;

      res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword,
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
