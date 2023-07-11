import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the natours application!',
  });
});

export default app;
