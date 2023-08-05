import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config('./.env');
connectDB(process.env.DATABASE_URL);

// eslint-disable-next-line import/first
import app from './app.js';

const PORT = process.env.PORT || 8000;
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
