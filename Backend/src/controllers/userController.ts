// src/controllers/userController.ts

import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserService } from '../services/userServices';
import { OtpService } from '../services/otpService';
import { TYPES } from '../types/types';
import { ConflictError } from '../errors/conflictErrors';
import { CreateUserDTO, CreateUserSchema } from '../dtos/CreateUserDTO';
import { VerifyOtpDTO,VerifyOtpSchema } from '../dtos/VerifyOtpDTO';
import { UserLoginSchema ,UserLoginDTO } from '../dtos/UserLoginDTO';

export interface IUserController {
  register(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  login(req: Request, rees:Response):Promise<void>
  verifyOtpAndRegister(req: Request, res: Response): Promise<void>;
}

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private readonly userService: IUserService,
    @inject(TYPES.OtpService) private readonly otpService: OtpService
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const parsed = CreateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: parsed.error.errors?.[0]?.message || 'Validation failed',
        });
        return;
      }

      const userData: CreateUserDTO = parsed.data;

      const exists = await this.userService.userExists(userData.email);
      if (exists) {
        res.status(409).json({ message: 'Email already in use' });
        return;
      }

      await this.otpService.generateOtp(userData.email);

      res.status(200).json({ message: 'OTP sent successfully' ,success:true});
    } catch (error) {
      if (error instanceof ConflictError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  async verifyOtpAndRegister(req: Request, res: Response): Promise<void> {
    try {
      const parsed = VerifyOtpSchema.safeParse(req.body);
      console.log(parsed ,req.body )
      if (!parsed.success) {
        res.status(400).json({
          message: parsed.error.errors?.[0]?.message || 'Validation failed',
        });
        return;
      }
  
      const userData: VerifyOtpDTO = parsed.data;
  
      const otpVerify = await this.otpService.verifyOtp(userData.email, userData.otp);
      if (!otpVerify) {
        res.status(400).json({ message: 'Invalid or expired OTP' });
        return;
      }
  
      const exists = await this.userService.userExists(userData.email);
      if (exists) {
        res.status(409).json({ message: 'Email already in use' });
        return;
      }
  
      const { user, accessToken, refreshToken } = await this.userService.registerUser(userData);
      if (!user || !accessToken || !refreshToken) {
        res.status(500).json({ message: 'User creation failed' });
        return;
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
        message: 'User registered successfully',
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
  

  
 
async resendOtp(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    const result = await this.otpService.generateOtp(email);

    

    res.status(200).json({ success: true, message: result });
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
}


async login(req: Request, res: Response): Promise<void> {
  try {
    const parsed = UserLoginSchema.safeParse(req.body);
    console.log(parsed ,req.body )
    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.errors?.[0]?.message || 'Validation failed',
      });
      return;
    }

    const userData: UserLoginDTO = parsed.data;



    const { user, accessToken, refreshToken } = await this.userService.userLogin(userData);
    if (!user || !accessToken || !refreshToken) {
      res.status(500).json({ message: 'User creation failed' });
      return;
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
    console.log(user,"here is the user data")

    res.status(201).json({
      success: true,
      data: user,
      accessToken,
      message: 'User registered successfully',
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
