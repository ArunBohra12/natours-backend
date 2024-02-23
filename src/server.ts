import express from 'express';

import logger from '@core/logger/logger';
import env from '@core/environment/environment';
import globalErrorHandler from '@core/errors/globalErrorHandler';
import corsMiddleware from 'middlewares/corsMiddleware';
import fetchOriginFromDatabase from 'services/originService';

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

app.listen(env.PORT, () =>
  logger.info(`Server is up and running on port ${env.PORT}`),
);
