import AppError from '../error/appError.js';
import JwtHelper from '../helpers/jwtHelper.js';
import logger from '../logger/logger.js';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

export const isVerifiedUser = catchAsync(async (req, res, next) => {
  if (!req.email) {
    logger.error("Property email doesn't exist in req. userAuth.js:9");
    return next(new AppError("Can't proceed with the request, please try again", 400));
  }

  const user = await User.findOne({ email: req.email }).select('+isVerified');

  if (user.isVerified === true) {
    return next();
  }

  next(new AppError('Please verify your email to proceed.', 401));
});

export const requiresLogin = catchAsync(async (req, res, next) => {
  const { authorization: token } = req.headers;

  if (!token) {
    logger.error('Token not present. userAuth:25');
    return next(new AppError('Please login to continue', 403));
  }

  if (!`${token}`.startsWith('Bearer') || !token.split(' ')[1]) {
    logger.error('Wrong token present. userAuth:29');
    return next(new AppError('Please login to continue', 403));
  }

  const jwt = new JwtHelper(process.env.JWT_SECRET_KEY);

  const data = jwt.verifyToken(token.split(' ')[1]);

  const user = await User.findById(data._id);

  if (!user) {
    return next(new AppError('Please login to continue', 403));
  }

  req.user = user;
  next();
});
