import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import catchAsync from '@core/errors/catchAsync';
import { UserSignupDataType } from '../userModel';
import UserSignupInteractor from './userSignupInteractor';
import UserSignupEntity from './userSignupEntity';

const userSignupController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password }: UserSignupDataType = req.body;

    const userInteractor = new UserSignupInteractor(
      new UserSignupEntity(),
      validator,
    );

    const user = await userInteractor.execute({ name, email, password });

    res.status(201).json({
      status: true,
      message: 'User signed up successfully',
      data: {
        user,
      },
    });
  },
);

export default userSignupController;
