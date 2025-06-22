// src/routes/userRoutes.ts
import { Router } from 'express';
import { container } from '../inversify.config';
import { IUserController } from '../controllers/userController';
import { TYPES } from '../types/types';

const router = Router();
const userController = container.get<IUserController>(TYPES.UserController);

router.post('/register', (req, res) => userController.register(req, res));

export default router;