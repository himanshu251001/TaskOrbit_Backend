import jwt from 'jsonwebtoken';

const generateAccessToken = (user, impersonatedBy = null) => {
    const payload = { id: user.id, grade: user.grade, email: user.email };


    if (impersonatedBy) {
        payload.impersonated_by = impersonatedBy;
        payload.is_impersonation = true;
    }

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN, algorithm: 'HS256' }
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