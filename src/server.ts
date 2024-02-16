import express from 'express';

import globalErrorHandler from './core/errors/globalErrorHandler';

const app = express();
const port: number | string = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Welcome to Natours API',
  });
});

app.use(globalErrorHandler);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is up and running on port ${port}`));
