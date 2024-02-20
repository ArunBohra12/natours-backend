import express from 'express';

import logger from '@core/logger/logger';
import env from '@core/environment/environment';
import globalErrorHandler from '@core/errors/globalErrorHandler';
import corsMiddleware from '@api/middlewares/corsMiddleware';

const app = express();

app.use(corsMiddleware(async () => ['http://localhost:4173']));

app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Welcome to Natours API',
  });
});

app.use(globalErrorHandler);

app.listen(env.PORT, () =>
  logger.info(`Server is up and running on port ${env.PORT}`),
);
