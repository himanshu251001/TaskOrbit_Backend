import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.loginHandler);
router.post('/refresh', authController.refreshTokenHandler);
// router.post('/logout', authController.logout);
// router.post('/register', authController.register);

export default router;
