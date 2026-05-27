
import argon2 from 'argon2';
import { generateAccessToken, generateRefreshToken } from '../utils/helper.js';
import { prisma } from '../lib/prisma.ts';
import jwt from 'jsonwebtoken';
import { getMicrosoftClient } from '../config/oidc.js';
import { generators } from 'openid-client';


const extractDomain = (email) => {
    if (!email || !email.includes('@')) return null;
    return email.split('@')[1].toLowerCase();
};

const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.passwordHash) {
            return res.status(400).json({ message: "This account is registered via OAuth. Please log in with your OAuth provider." });
        }

        const isMatch = await argon2.verify(user.passwordHash, password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerHandler = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const domain = extractDomain(email);
        if (!domain) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const organization = await prisma.organization.findFirst({
            where: { domain }
        });

        if (!organization) {
            return res.status(400).json({ message: "No organization found with this email domain" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const passwordHash = await argon2.hash(password);

        const user = await prisma.user.create({
            data: {
                email,
                name: name,
                passwordHash,
                authProvider: 'LOCAL'
            }
        });

        await prisma.organizationMember.create({
            data: {
                organizationId: organization.id,
                userId: user.id,
                role: 'EMPLOYEE'
            }
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // Set to true in prod
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            accessToken,
            message: "User registered and logged in successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refreshTokenHandler = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.status(401).json({ message: "No refresh token provided" });
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const userId = decoded.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(403).json({ message: "Invalid refresh token" });

        const isMatch = user.refreshToken === refreshToken;
        if (!isMatch)
            return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

const logoutHandler = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(204).send();
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const userId = decoded.id;

        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.clearCookie('refreshToken');
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
};

const impersonateHandler = async (req, res) => {
    try {
        const admin = req.user;

        if (!admin.isAdmin || admin.is_impersonation) {
            return res.status(403).json({ message: 'Forbidden – admin privileges required and nested impersonation is not allowed' });
        }

        const { targetUserId } = req.body;
        if (!targetUserId) {
            return res.status(400).json({ message: 'targetId is required' });
        }

        if (admin.id === targetUserId) {
            return res.status(400).json({ message: 'Self impersonation is not allowed' });
        }

        const target = await prisma.user.findUnique({ where: { id: targetUserId } });
        if (!target) {
            return res.status(404).json({ message: 'Target user not found' });
        }

        await prisma.auditLog.create({
            data: {
                action: 'IMPERSONATE',
                actorId: admin.id,
                targetId: target.id,
                metadata: { adminEmail: admin.email, targetEmail: target.email }
            }
        });

        const targetAccessToken = generateAccessToken(target, admin.id);


        res.status(200).json({
            success: true,
            accessToken: targetAccessToken,
            impersonating: {
                id: target.id,
                email: target.email,
                full_name: target.full_name
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const stopImpersonationHandler = async (req, res) => {
    try {
        if (!req.user || !req.user.isImpersonation) {
            return res.status(400).json({ message: 'No active impersonation session found to revert' });
        }

        const adminId = req.user.impersonatedBy;
        const targetId = req.user.id;

        const admin = await prisma.user.findUnique({ where: { id: adminId } });
        if (!admin || !admin.isAdmin) {
            return res.status(403).json({ message: 'Original admin not found or lacks privileges' });
        }
        // Log revert
        await prisma.auditLog.create({
            data: {
                action: 'REVERT_IMPERSONATE',
                actorId: admin.id,
                targetId: targetId,
                metadata: { adminEmail: admin.email, targetEmail: req.user.email }
            }
        });

        const freshAccessToken = generateAccessToken(admin);


        res.status(200).json({
            success: true,
            accessToken: freshAccessToken,
            message: 'Impersonation reverted successfully. Token refreshed for Admin.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const handleMicrosoftOAuthInitiation = async (req, res, action) => {
    try {
        const client = getMicrosoftClient();
        const state = generators.state();
        const code_verifier = generators.codeVerifier();
        const code_challenge = generators.codeChallenge(code_verifier);

        res.cookie('oauth_state', state, {
            httpOnly: true,
            secure: false, // Set to true in prod
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.cookie('oauth_verifier', code_verifier, {
            httpOnly: true,
            secure: false, // Set to true in prod
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.cookie('oauth_action', action, {
            httpOnly: true,
            secure: false, // Set to true in prod
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        const authorizationUrl = client.authorizationUrl({
            scope: 'openid email profile',
            state,
            code_challenge,
            code_challenge_method: 'S256',
        });
        res.json({ success: true, url: authorizationUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const initiateMicrosoftOAuth = async (req, res) => {
    await handleMicrosoftOAuthInitiation(req, res, 'login');
};

const initiateMicrosoftOAuthSignUp = async (req, res) => {
    await handleMicrosoftOAuthInitiation(req, res, 'signup');
};


const microsoftCallback = async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL;
    try {
        let options = {};
        const client = getMicrosoftClient();
        const params = client.callbackParams(req);
        const expectedState = req.cookies.oauth_state;
        const codeVerifier = req.cookies.oauth_verifier;
        const action = req.cookies.oauth_action || 'login';

        if (!expectedState || !codeVerifier) {
            return res.status(400).send("Session expired or invalid login initiation.");
        }

        if (params.state !== expectedState) {
            return res.status(400).send("State validation failed. Potential CSRF detected.");
        }

        const tokenSet = await client.callback(
            process.env.MICROSOFT_REDIRECT_URI,
            params,
            { code_verifier: codeVerifier, state: expectedState }
        );

        const claims = tokenSet.claims();
        res.clearCookie('oauth_state');
        res.clearCookie('oauth_verifier');
        res.clearCookie('oauth_action');

        const { sub, email, name } = claims;

        if (!email) {
            return res.redirect(
                `${frontendUrl}/login?auth=failed&message=Email not provided by Microsoft`
            );
        }

        if (action === 'signup') {
            const domain = extractDomain(email);
            if (!domain) {
                return res.redirect(
                    `${frontendUrl}/login?auth=failed&message=Not a valid Domain`
                );
            }

            const organization = await prisma.organization.findFirst({
                where: { domain }
            });

            if (!organization) {
                return res.redirect(
                    `${frontendUrl}/login?auth=failed&message=No organization found with this email domain&createOrganization=true`
                );
            }
            let user = await prisma.user.findUnique({ where: { email } });

            if (user) {
                return res.redirect(
                    `${frontendUrl}/login?auth=failed&message=User already registered. Please log in.`
                );
            }

            user = await prisma.user.create({
                data: {
                    email,
                    name: name,
                    authProvider: 'MICROSOFT'
                }
            });
            const result = await prisma.organizationMember.create({
                data: {
                    organizationId: organization.id,
                    userId: user.id,
                    role: 'EMPLOYEE'
                }
            });
            return res.redirect(
                `${frontendUrl}/login?auth=success&message=Account created successfully. Please login`
            );
        } else {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.redirect(
                    `${frontendUrl}/login?auth=failed&message=User not found`
                );
            }
            const refreshToken = generateRefreshToken(user);

            await prisma.user.update({
                where: { id: user.id },
                data: { refreshToken }
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.redirect(
                `${frontendUrl}/dashboard`
            );
        }
    } catch (error) {
        res.redirect(
            `${frontendUrl}/login?auth=failed&message=${encodeURIComponent(error.message)}`
        );
    }
};
const orgRegistrationHandler = async (req, res) => {
    try {
        const { name, domain } = req.body;
        const org = await prisma.organization.findFirst({
            where: {
                OR: [
                    { domain },
                    { name }
                ]
            }
        });
        if (org) {
            return res.status(400).json({ message: "Organization already exists" });
        }
        const organization = await prisma.organization.create({
            data: {
                name,
                domain
            }
        });
        res.status(201).json({
            success: true,
            organization,
            message: "Organization registered successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    loginHandler,
    registerHandler,
    refreshTokenHandler,
    logoutHandler,
    impersonateHandler,
    stopImpersonationHandler,
    initiateMicrosoftOAuth,
    initiateMicrosoftOAuthSignUp,
    microsoftCallback,
    orgRegistrationHandler
};