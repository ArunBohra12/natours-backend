import express from 'express';

import corsMiddleware from 'middlewares/corsMiddleware';
import fetchOriginFromDatabase from 'services/originService';
import globalErrorHandler from '@core/errors/globalErrorHandler';
import apiV1Routes from '@api/v1/routes/apiRoutes';

const app = express();

app.use(express.json());

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

app.use('/api/v1', apiV1Routes);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: false,
    message: `Can't make ${req.method} request on ${req.url}`,
  });
});

app.use(globalErrorHandler);

export default app;
