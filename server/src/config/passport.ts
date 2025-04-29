import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { query } from "./db";

// --- Local Strategy (Email/Password Login) ---
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const queryResult = await query('SELECT * FROM users WHERE email = $1', [email]);
      const user = queryResult.rows[0];
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (err) {
      return done(err);
    }
  })
);

// --- JWT Strategy ---
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'fallbackSecret',
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const queryResult = await query('SELECT * FROM users WHERE id = $1', [payload.sub]);
      const user = queryResult.rows[0];
      if (user) {
         const { password: _, ...userWithoutPassword } = user;
         return done(null, userWithoutPassword);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Middleware to protect routes
export const authenticateJWT = passport.authenticate('jwt', { session: false });

export default passport;
