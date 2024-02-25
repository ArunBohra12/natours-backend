import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import catchAsync from '@core/errors/catchAsync';
import UserLoginInteractor from './userLoginInteractor';
import UserLoginEntity from './userLoginEntity';

const userLoginWithEmailController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const userInteractor = new UserLoginInteractor(
      new UserLoginEntity(),
      validator,
    );

    const userLoginData = await userInteractor.executeLoginWithEmail(
      email,
      password,
    );

    res.status(200).json({
      status: true,
      message: 'Login successful',
      data: userLoginData.userData,
      token: userLoginData.token,
    });
  },
);

export default userLoginWithEmailController;
