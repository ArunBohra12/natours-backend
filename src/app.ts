import express from 'express';

import corsMiddleware from 'middlewares/corsMiddleware';
import fetchOriginFromDatabase from 'services/originService';
import globalErrorHandler from '@core/errors/globalErrorHandler';

const app = express();

app.get('/', corsMiddleware(fetchOriginFromDatabase, 'public'), (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Welcome to Natours API',
  });
});

app.get(
  '/admin',
  corsMiddleware(fetchOriginFromDatabase, 'admin'),
  (req, res) => {
    res.status(200).json({
      status: true,
      message: 'This is a route only for admins',
    });
  },
);

app.use(globalErrorHandler);

export default app;
