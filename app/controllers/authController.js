import AppError from '../error/appError.js';
import GoogleAuthHelper from '../helpers/googleAuthHelper.js';
import logger from '../logger/logger.js';
import catchAsync from '../utils/catchAsync.js';

export const signInWithGoogle = catchAsync(async (req, res, next) => {
  const authHelper = new GoogleAuthHelper();

  const authUrl = authHelper.addScopes('profile').generateAuthUrl();

  if (!authUrl) {
    logger.error('Auth Url not present');
    logger.error(authUrl);

    return next(new AppError('Google signin currently available. Please try again!', 500));
  }

  res.status(200).json({
    status: 1,
    message: 'Successfully generated google auth URL',
    data: {
      url: authUrl,
    },
  });
});

export const googleOAuthRedirectHandler = catchAsync(async (req, res, next) => {
  const { code } = req.query;

  const authHelper = new GoogleAuthHelper();
  const tokens = await authHelper.getAuthTokens(code);

  res.status(200).json({
    status: 1,
    data: {
      tokens,
    },
  });
});
