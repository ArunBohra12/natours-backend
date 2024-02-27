import { Request, Response } from 'express';

import catchAsync from '@core/errors/catchAsync';
import UserGoogleSigninInteractor from './userGoogleSigninInteractor';
import UserGoogleSigninEntity from './userGoogleSigninEntity';

export const getGoogleAuthUrlHandler = catchAsync(
  async (req: Request, res: Response) => {
    const googleSigninInteractor = new UserGoogleSigninInteractor(
      new UserGoogleSigninEntity(),
    );
    const authUrl = googleSigninInteractor.getAuthUrl();

    res.status(200).json({
      status: 200,
      data: {
        url: authUrl,
      },
    });
  },
);

export const userLoginWithGoogleController = catchAsync(
  async (req: Request, res: Response) => {
    const { code } = req.query;

    const googleSigninInteractor = new UserGoogleSigninInteractor(
      new UserGoogleSigninEntity(),
    );
    const userGoogleSigninData =
      await googleSigninInteractor.executeLoginWithGoogle(code as string);

    res.status(200).json({
      status: 200,
      token: userGoogleSigninData.token,
      data: userGoogleSigninData.userData,
    });
  },
);
