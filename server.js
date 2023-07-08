import express from 'express';
import dotenv from 'dotenv';

dotenv.config('./.env');

const app = express();

const PORT = process.env.PORT || 8000;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
