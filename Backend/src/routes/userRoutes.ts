// src/routes/userRoutes.ts
import { Router } from 'express';
import { container } from '../inversify.config';
import { IUserController } from '../controllers/userController';
import { TYPES } from '../types/types';

const router = Router();
const userController = container.get<IUserController>(TYPES.UserController);

router.post('/register', (req, res) => userController.register(req, res));
router.post('/verifyOtp',(req,res)=>userController.verifyOtpAndRegister(req,res))
router.post('/resendOtp',(req,res)=>userController.resendOtp(req,res))
export default router;  