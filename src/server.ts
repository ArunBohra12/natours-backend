import express from 'express';

import globalErrorHandler from './core/errors/globalErrorHandler';
import env from './core/environment/environment';

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Welcome to Natours API',
  });
});

app.use(globalErrorHandler);

// eslint-disable-next-line no-console
app.listen(env.PORT, () =>
  console.log(`Server is up and running on port ${env.PORT}`),
);
