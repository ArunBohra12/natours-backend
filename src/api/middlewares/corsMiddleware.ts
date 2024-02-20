import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import ApiError from '@core/errors/apiError';

type FetchOriginsFunction = () => Promise<string[]>;

type MiddlewareFunction = (
  fetchOrigins: FetchOriginsFunction,
) => (req: Request, res: Response, next: NextFunction) => void;

const corsMiddleware: MiddlewareFunction =
  (fetchOriginsFromDatabase) => async (req, res, next) => {
    try {
      const allowedOrigins = await fetchOriginsFromDatabase();

      const corsOptions = {
        origin: (
          origin: string,
          callback: (err: ApiError | null, allow?: boolean) => void,
        ) => {
          if (allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(
              new ApiError(
                'Not allowed by CORS',
                500,
                'AuthorizationError',
                'Operational',
              ),
            );
          }
        },
      };

      // Use CORS middleware with custom options
      cors(corsOptions)(req, res, next);
    } catch (error) {
      // Pass the error to the error handling middleware
      next(error);
    }
  };

export default corsMiddleware;
