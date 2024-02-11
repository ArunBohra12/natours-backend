import express from 'express';
import AppError from './app/error/appError.js';
import globalErrorHandler from './app/error/globalErrorHandler.js';
import userRouter from './app/routes/userRoutes.js';
import tourRouter from './app/routes/tourRoutes.js';
import authRouter from './app/routes/authRoutes.js';
import adminRouter from './app/routes/admin/adminRoutes.js';
import corsMiddleware from './app/middlewares/cors.js';
import { requiresLogin } from './app/middlewares/userAuth.js';

const app = express();

app.use(corsMiddleware());

// Body parser, reading data from body into req.body
app.use(express.json());

app.get('/', requiresLogin, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the natours application!',
  });
});

app.use('/api/user', userRouter);
app.use('/api/tour', tourRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Matches unavailable routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't ${req.method} ${req.path} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
