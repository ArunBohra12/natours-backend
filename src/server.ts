import express from 'express';

import logger from '@core/logger/logger';
import env from '@core/environment/environment';
import globalErrorHandler from '@core/errors/globalErrorHandler';

const app = express();

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
