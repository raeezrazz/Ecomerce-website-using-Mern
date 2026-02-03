"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const googleAuthController_1 = require("../controllers/googleAuthController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', (req, res) => userController_1.userController.register(req, res));
router.post('/login', (req, res) => userController_1.userController.login(req, res));
router.post('/verifyOtp', (req, res) => userController_1.userController.verifyOtpAndRegister(req, res));
router.post('/resendOtp', (req, res) => userController_1.userController.resendOtp(req, res));
router.post('/refreshToken', (req, res) => userController_1.userController.refreshToken(req, res));
router.post('/google-auth', (req, res) => googleAuthController_1.googleAuthController.verifyGoogleToken(req, res));
// Protected routes
router.get('/profile', authMiddleware_1.authenticateToken, (req, res) => userController_1.userController.getProfile(req, res));
router.put('/profile', authMiddleware_1.authenticateToken, (req, res) => userController_1.userController.updateProfile(req, res));
router.post('/logout', authMiddleware_1.authenticateToken, (req, res) => userController_1.userController.logout(req, res));
exports.default = router;
