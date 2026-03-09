import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email }, //payload 
        process.env.JWT_SECRET, //secret key
        { expiresIn: process.env.JWT_EXPIRES_IN, algorithm: 'HS256' } //options
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, algorithm: 'HS256' }
    );
};


export { generateAccessToken, generateRefreshToken };