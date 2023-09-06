import AppError from '../error/appError.js';
import GoogleAuthHelper from '../helpers/googleAuthHelper.js';
import JwtHelper from '../helpers/jwtHelper.js';
import logger from '../logger/logger.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import { googleUserSignup } from './userController.js';

const loginHandler = (userData, responseData, statusCode, res) => {
  const jwt = new JwtHelper(process.env.JWT_SECRET_KEY);

  const token = jwt.generateToken(userData, 90);

  return res.status(statusCode).json({
    ...responseData,
    token,
  });
};

export const signInWithGoogle = catchAsync(async (req, res, next) => {
  const authHelper = new GoogleAuthHelper();

  const authUrl = authHelper.addScopes('profile', 'email').generateAuthUrl();

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

export const googleAuthVerifyHandler = catchAsync(async (req, res, next) => {
  const { code } = req.query;

  const authHelper = new GoogleAuthHelper();
  // Will get tokens data from google
  // If the code is invalid/expired/wrong it will produce an error
  const tokens = await authHelper.getAuthTokens(code);

  if (!tokens || Object.keys(tokens).length === 0) {
    logger.error(authHelper);
    logger.error(tokens);
    return next(new AppError('Google authentication failed. Please try again!', 400));
  }

  // No need to verify JWT as it comes already verified from Google OAuth
  const {
    name: googleName,
    email: googleEmail,
    sub: googleSub,
    picture: googlePicture,
  } = JwtHelper.decodeToken(tokens.id_token) || {};

  if (!googleName || !googleEmail || !googleSub) {
    logger.error('No data returned in google auth -> key: id_token');
    logger.error(tokens);
    return next(new AppError('Google authentication failed. Please try again!', 400));
  }

  const existingUser = await User.findOne({ email: googleEmail }).select('+googleAccount');

  // Register user if not already registered
  if (!existingUser) {
    const newUser = await googleUserSignup(
      { googleName, googleEmail, googleSub, googlePicture },
      { refreshToken: tokens.refresh_token }
    );

    const newUserId = newUser.googleAccount.googleId;

    newUser.googleAccount = undefined;

    return loginHandler(
      { googleId: newUserId },
      { status: 1, message: 'Signed up successfully', data: { newUser } },
      201,
      res
    );
  }

  const existingUserId = existingUser.googleAccount.googleId;
  // Remove sensitive/unwanted data
  existingUser.googleAccount = undefined;
  existingUser.__v = undefined;
  existingUser.password = undefined;

  // Just login user if it already exists
  return loginHandler(
    { googleId: existingUserId },
    { status: 1, message: 'Logged in successfully', data: { user: existingUser } },
    200,
    res
  );
});
