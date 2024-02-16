import { Request, Response, NextFunction } from 'express';

import ApiError from './apiError';
import env from '../environment/environment';

const handleErrorsInDevelopment = (res: Response, err: ApiError) => {
  res.status(200).json({
    status: false,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleErrorsInProduction = (res: Response, err: ApiError) => {
  // TODO: need to handle production errors

  if (err.statusCode === 500) {
    return res.status(err.statusCode).json({
      status: false,
      message: 'Sorry, something went wrong',
    });
  }
};

const globalErrorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let error: ApiError;

  if (!(err instanceof ApiError)) {
    error = new ApiError(err.message, 500, 'AuthenticationError', 'Functional');
  } else {
    error = err;
  }

  if (env.NODE_ENV === 'production') {
    return handleErrorsInProduction(res, error);
  }

  return handleErrorsInDevelopment(res, error);
};

export default globalErrorHandler;
