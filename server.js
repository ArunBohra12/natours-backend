import express from 'express';
import dotenv from 'dotenv';

dotenv.config('./.env');

const app = express();

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
