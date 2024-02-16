import { NextFunction, Request, Response } from 'express';

/**
 * Wrap the async function with catchAsync to catch the errors inside the function
 * NOTE: Only to be used in middlewares where we've access to the next variable
 * @param fn Express function that handles the request
 * @returns Callable function that handles catching errors
 */
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

export default catchAsync;
