import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.loginHandler);
router.post('/refresh', authController.refreshTokenHandler);
router.post('/logout', authController.logoutHandler);
router.post('/register', authController.registerHandler);
router.post('/impersonate', authMiddleware, authController.impersonateHandler);
router.post('/stopImpersonation', authMiddleware, authController.stopImpersonationHandler);

// OIDC Authentication Endpoints
router.get('/microsoft/login', authController.initiateMicrosoftOAuth);
router.get('/microsoft/signup', authController.initiateMicrosoftOAuthSignUp);
router.get('/callback/microsoft', authController.microsoftCallback);

router.post('/organization/register', authController.orgRegistrationHandler);

export default router;
