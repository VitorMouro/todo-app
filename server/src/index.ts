// src/index.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from './config/passport'; // Import configured passport
import { authenticateJWT } from './config/passport'; // Import JWT auth middleware
import authRouter from './modules/auth'; // Import auth routes
import prisma from './db'; // Ensure db connection is potentially used early

dotenv.config(); // Load environment variables from .env file

console.log('Hello, World!');

const app: Express = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors(/* Configure CORS options if needed, e.g., { origin: process.env.CORS_ORIGIN } */));
app.use(express.json()); // Parse JSON request bodies
app.use(passport.initialize()); // Initialize Passport

// --- Routes ---
// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Todo Backend API is running! YAY!');
});


// Authentication routes
app.use('/auth', authRouter);

// --- Protected Routes ---
// Example protected route
app.get('/api/me', authenticateJWT, (req: Request, res: Response) => {
  // If authenticateJWT middleware passes, req.user contains the authenticated user object (from JWT payload verification)
  console.log("/api/me request");
  res.json({ user: req.user });
});

// Add other API routes here (e.g., for Todos) later
// app.use('/api/todos', authenticateJWT, todoRouter);


// --- Global Error Handler ---
// Basic error handler - customize as needed
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log error stack trace to console
    // Avoid sending stack trace in production
    const statusCode = (err as any).statusCode || 500; // Use custom status code if available
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        // Optionally include stack in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

// --- Start Server ---
const server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// --- Graceful Shutdown ---
// Handle process termination signals
const gracefulShutdown = (signal: string) => {
  process.on(signal, async () => {
    console.log(`\n👋 ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('✅ HTTP server closed.');
      // Close database connection
      await prisma.$disconnect();
      console.log('✅ Database connection closed.');
      process.exit(0);
    });
  });
};

gracefulShutdown('SIGINT'); // Handle Ctrl+C
gracefulShutdown('SIGTERM'); // Handle kill commands

export default app; // Export for testing purposes
