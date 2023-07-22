import express from 'express';
import userRouter from './app/routes/userRoutes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the natours application!',
  });
});

app.use('/api/user', userRouter);

export default app;
