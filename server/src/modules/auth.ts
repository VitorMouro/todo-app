// src/modules/auth.ts
import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import prisma from '../db';
import { registerSchema, loginSchema } from '../utils/validation';

const router = Router();
const SALT_ROUNDS = 10; // For bcrypt hashing

// --- Registration ---
router.post('/register', async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Email already exists' });
      return ;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      // Select only non-sensitive fields to return
      select: { id: true, email: true, name: true, createdAt: true }
    });

    res.status(201).json({ message: 'User registered successfully', user });

} catch (error: any) {
    // Handle Zod validation errors specifically
    if (error instanceof require('zod').ZodError) {
      res.status(400).json({ message: "Validation failed", errors: error.errors });
      return;
    }
    next(error); // Pass other errors to the global error handler
  }
});

// --- Login ---
router.post('/login', async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        // Validate input first
        loginSchema.parse(req.body);

        passport.authenticate('local', { session: false }, (err: any, user: Express.User | false | null, info: any) => {
            if (err) { return next(err); } // Handle unexpected errors
            if (!user) {
                // Provide specific message from passport strategy if available
                res.status(401).json({ message: info?.message || 'Login failed' });
                return;
            }

            // User authenticated successfully, generate JWT
            const payload = { sub: (user as any).id, email: (user as any).email }; // Use 'sub' standard claim for user ID
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }

            const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Token expires in 1 hour

            // Return user info (without password) and token
            res.json({ message: 'Login successful', user, token });
            return;

        })(req, res, next); // Important: call the passport middleware

    } catch (error: any) {
         // Handle Zod validation errors specifically
         if (error instanceof require('zod').ZodError) {
           res.status(400).json({ message: "Validation failed", errors: error.errors });
           return;
         }
         next(error); // Pass other errors to the global error handler
    }
});


export default router;
