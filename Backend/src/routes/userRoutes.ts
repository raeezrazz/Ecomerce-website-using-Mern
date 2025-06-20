import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
const router = Router();
const userController = new UserController();

// Bind the register method once

router.post('/register', userController.register.bind(userController));

export default router;
