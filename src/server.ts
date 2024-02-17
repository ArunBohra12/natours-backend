import express from 'express';

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
  // eslint-disable-next-line no-console
  console.log(`Server is up and running on port ${env.PORT}`),
);
