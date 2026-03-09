import passport from 'passport';
import '../config/passport.js'; // Initialize passport strategy

const authMiddleware = passport.authenticate('jwt', { session: false });

export default authMiddleware;