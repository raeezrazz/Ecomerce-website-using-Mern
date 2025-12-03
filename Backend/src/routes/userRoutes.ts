// src/routes/userRoutes.ts
import { Router } from 'express';
import { userController } from '../controllers/userController';
import { googleAuthController } from '../controllers/googleAuthController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/verifyOtp', (req, res) => userController.verifyOtpAndRegister(req, res));
router.post('/resendOtp', (req, res) => userController.resendOtp(req, res));
router.post('/refreshToken', (req, res) => userController.refreshToken(req, res));
router.post('/google-auth', (req, res) => googleAuthController.verifyGoogleToken(req, res));

// Protected routes
router.get('/profile', authenticateToken, (req, res) => userController.getProfile(req, res));
router.put('/profile', authenticateToken, (req, res) => userController.updateProfile(req, res));
router.post('/logout', authenticateToken, (req, res) => userController.logout(req, res));

export default router;
