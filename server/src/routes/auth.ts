import { Router, Request, Response, NextFunction } from 'express';import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { query } from '../config/db';
import { registerSchema, loginSchema } from '../utils/validation';
import { authenticateJWT } from '../config/passport';

const router = Router();
const SALT_ROUNDS = 10;

// --- Registration ---
router.post('/register', async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const queryResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    const existingUser = queryResult.rows[0];
    if (existingUser) {
      res.status(409).json({ message: 'Email already exists' });
      return ;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const queryString = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
    const user = (await query(queryString, [email, hashedPassword])).rows[0];

    res.status(201).json({ message: 'User registered successfully', user });

} catch (error: any) {
    if (error instanceof require('zod').ZodError) {
      res.status(400).json({ message: "Validation failed", errors: error.errors });
      return;
    }
    next(error);
  }
});

// --- Login ---
router.post('/login', async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        loginSchema.parse(req.body);

        passport.authenticate('local', { session: false }, (err: any, user: Express.User | false | null, info: any) => {
            if (err) { return next(err); }
            if (!user) {
                res.status(401).json({ message: info?.message || 'Login failed' });
                return;
            }

            const payload = { sub: (user as any).id, email: (user as any).email };
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }

            const token = jwt.sign(payload, secret, { expiresIn: '30d' });

            res.json({ message: 'Login successful', user, token });
            return;

        })(req, res, next);

    } catch (error: any) {
         if (error instanceof require('zod').ZodError) {
           res.status(400).json({ message: "Validation failed", errors: error.errors });
           return;
         }
         next(error);
    }
});

router.get('/', authenticateJWT, (req: Request, res: Response) => {
  res.json({ user: req.user });
});


export default router;
