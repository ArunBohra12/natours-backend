import express from 'express';
import AppError from './app/error/appError.js';
import globalErrorHandler from './app/error/globalErrorHandler.js';
import userRouter from './app/routes/userRoutes.js';

const app = express();

// Body parser, reading data from body into req.body
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the natours application!',
  });
});

app.use('/api/user', userRouter);

// Matches unavailable routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't ${req.method} ${req.path} on this server`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
