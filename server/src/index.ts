import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from './config/passport';
import { authenticateJWT } from './config/passport';
import authRouter from './modules/auth';
import prisma from './db';

dotenv.config();

console.log('Hello, World!');

const app: Express = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors({
    origin: process.env.CORS_ORIGIN || "localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// --- Routes ---
app.get('/', (req: Request, res: Response) => {
  res.send('Todo Backend API is running! YAY!');
});

// Authentication routes
app.use('/api/auth', authRouter);

// --- Protected Routes ---
app.get('/api/me', authenticateJWT, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

// app.use('/api/todos', authenticateJWT, todoRouter);


// --- Global Error Handler ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const statusCode = (err as any).statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

// --- Start Server ---
const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// --- Graceful Shutdown ---
const gracefulShutdown = (signal: string) => {
  process.on(signal, async () => {
    console.log(`\n👋 ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('✅ HTTP server closed.');
      await prisma.$disconnect();
      console.log('✅ Database connection closed.');
      process.exit(0);
    });
  });
};

gracefulShutdown('SIGINT');
gracefulShutdown('SIGTERM');

export default app;
