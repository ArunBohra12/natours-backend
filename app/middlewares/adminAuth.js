import logger from '../logger/logger.js';
import AppError from '../error/appError.js';
import Admin from '../models/adminModel.js';
import JwtHelper from '../helpers/jwtHelper.js';
import catchAsync from '../utils/catchAsync.js';

export const requiresAdminLogin = catchAsync(async (req, res, next) => {
  const { authorization: token } = req.headers;

  if (!token) {
    logger.error('Token not present.');
    return next(new AppError('Please login to continue', 403));
  }

  if (!`${token}`.startsWith('Bearer') || !token.split(' ')[1]) {
    logger.error('Wrong token present.');
    return next(new AppError('Please login to continue', 403));
  }

  const jwt = new JwtHelper(process.env.ADMIN_JWT_SECRET_KEY);

  const data = jwt.verifyToken(token.split(' ')[1]);

  const admin = Admin.findById(data._id);

  if (!admin) {
    return next(new AppError('Please login to continue', 403));
  }

  req.admin = admin;
  next();
});
