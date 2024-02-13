import express from 'express';

const app = express();
const port: number | string = process.env.PORT || 8000;

console.log('arun');
app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Welcome to Natours API',
  });
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is up and running on port ${port}`));
