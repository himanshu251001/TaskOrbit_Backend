import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { prisma } from '../lib/prisma.ts';
import { jwt } from 'zod';

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256']

};
passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
        try {
            const user = await prisma.user.findFirst({
                where: { email: jwtPayload.email }
            });

            if (user) {
                user.isImpersonation = jwtPayload.is_impersonation || false;
                user.impersonatedBy = jwtPayload.impersonated_by || null;
            }


            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;
