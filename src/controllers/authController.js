
import argon2 from 'argon2';
import { generateAccessToken, generateRefreshToken } from '../utils/helper.js';
import { prisma } from '../lib/prisma.ts';
import jwt from 'jsonwebtoken';


const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
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

const refreshTokenHandler = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("Received refresh token:", refreshToken);

    if (!refreshToken)
        return res.status(401).json({ message: "No refresh token provided" });
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log("Decoded refresh token for user ID:", decoded);
        const userId = decoded.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(403).json({ message: "Invalid refresh token" });

        const isMatch = user.refreshToken === refreshToken;
        if (!isMatch)
            return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = generateAccessToken(user);
        console.log("Generated new access token for user:", newAccessToken);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
export default { loginHandler, 
    refreshTokenHandler };