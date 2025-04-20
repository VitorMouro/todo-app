// src/config/passport.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import prisma from '../db';

// --- Local Strategy (Email/Password Login) ---
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // Return user object without password
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (err) {
      return done(err);
    }
  })
);

// --- JWT Strategy (Verify Token) ---
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'fallbackSecret', // Use the secret from .env
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Payload contains the data encoded in the token (e.g., user id)
      const user = await prisma.user.findUnique({ where: { id: payload.sub } }); // 'sub' is typically the user id
      if (user) {
         const { password: _, ...userWithoutPassword } = user;
         return done(null, userWithoutPassword); // Attach user (without password) to req.user
      } else {
        return done(null, false); // User not found
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Middleware to protect routes
export const authenticateJWT = passport.authenticate('jwt', { session: false });

export default passport;
