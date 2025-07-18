// src/controllers/userController.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../services/userServices';
import { TYPES } from '../types/types';
import { ConflictError } from '../errors/conflictErrors';
import { CreateUserDTO, CreateUserSchema } from '../dtos/CreateUserDTO';

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
         res.status(400).json({
          message: parsed.error.errors?.[0]?.message || 'Validation failed',
        });
        return
      }
  
      const userData: CreateUserDTO = parsed.data;
  
      const exists = await this.userService.userExists(userData.email);
      if (exists) {
         res.status(409).json({ message: 'Email already in use' });
         return
      }
  
      const {user ,accessToken,refreshToken} = await this.userService.registerUser(userData);
      if (!user ||!accessToken || !refreshToken ) {
         res.status(500).json({ message: 'User creation failed' });
         return
      }
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });


      res.status(201).json({
        success: true,
        data: user,
        accessToken,
        message: "User Reguister successfull",
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
