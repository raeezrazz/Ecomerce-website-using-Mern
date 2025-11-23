// src/routes/userRoutes.ts
import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/verifyOtp', (req, res) => userController.verifyOtpAndRegister(req, res));
// router.post('/resendOtp', (req, res) => userController.resendOtp(req, res));
// router.get('/:userId', (req, res) => userController.getUserData(req, res));

export default router;
