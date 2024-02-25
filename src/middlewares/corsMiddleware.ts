import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { ApiError, authorizationError } from '@core/errors/apiError';
import env from '@core/environment/environment';
import { Origin } from 'model/originModel';

type CorsMiddlewareFunction = (
  fetchOrigins: (origin: string) => Promise<Origin[]>,
  routeType: Origin['type'],
) => (req: Request, res: Response, next: NextFunction) => void;

type CorsOptionsType = {
  origin: (
    origin: string,
    callback: (err: ApiError | null, allow?: boolean) => void,
  ) => void;
};

const corsMiddleware: CorsMiddlewareFunction =
  (fetchOrigin, routeType) => async (req, res, next) => {
    if (env.NODE_ENV === 'development') {
      const corsOptions: CorsOptionsType = {
        origin: (origin, callback) => callback(null, true),
      };
      return cors(corsOptions)(req, res, next);
    }

    try {
      const corsOptions: CorsOptionsType = {
        origin: async (origin, callback) => {
          const allowedOrigins = await fetchOrigin(origin);

          const isOriginAllowed = allowedOrigins.some(
            (allowedOrigin) =>
              allowedOrigin.type === 'admin' ||
              (allowedOrigin.type === 'public' && routeType === 'public'),
          );

          if (isOriginAllowed) {
            callback(null, true);
          } else {
            callback(authorizationError('Not allowed by CORS'));
          }
        },
      };

      // Use CORS middleware with custom options
      cors(corsOptions)(req, res, next);
    } catch (error) {
      // Pass the error to the error handling middleware
      const err = authorizationError('Not allowed by CORS');
      next(err);
    }
  };

export default corsMiddleware;
