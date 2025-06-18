import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// Bind the register method once

router.post('/register', userController.register);

export default router;
