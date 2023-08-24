import cors from 'cors';
import AllowedOrigins from '../controllers/allowedOriginsModel.js';
import AppError from '../error/appError.js';
import logger from '../logger/logger.js';

const getAllowedOrigins = async () => {
  try {
    const origins = await AllowedOrigins.find({});

    // Accessing the [0] index as we set all the URLs into a single mongodb document
    return origins[0]?.urls || [];
  } catch (error) {
    logger.error('Error loading allowed origins');
    logger.error(error);
    return new AppError('Internal server error', 500);
  }
};

const corsMiddleware = () =>
  cors({
    origin: async (origin, callback) => {
      if (!origin && process.env.NODE_ENV === 'development') {
        // Allows for tools like Postman to make request
        return callback(null, true);
      }

      try {
        const allowedOrigins = await getAllowedOrigins();

        if (allowedOrigins instanceof AppError) {
          return callback(allowedOrigins); // Block request
        }

        if (allowedOrigins.includes(origin)) {
          callback(null, true); // Allow the request.
        } else {
          callback(new AppError('Not allowed by CORS', 403)); // Block the request.
        }
      } catch (error) {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // Allow credentials (e.g., cookies) to be sent in the request.
    credentials: true,
    // Set the HTTP status code for successful preflight requests.
    optionsSuccessStatus: 204,
  });

export default corsMiddleware;
