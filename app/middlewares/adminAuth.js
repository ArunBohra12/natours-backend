import logger from '../logger/logger.js';
import AppError from '../error/appError.js';
import Admin from '../models/adminModel.js';
import { ADMIN } from '../../config/constants.js';
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

  const admin = await Admin.findById(data._id).select('+role');

  if (!admin) {
    return next(new AppError('Please login to continue', 403));
  }

  req.admin = admin;
  next();
});

// Returns all admin levels that can access routes that minRole can
const higherAdminRoles = minRole => {
  switch (minRole) {
    case ADMIN.highestLevelAdmin:
      return [ADMIN.roles.admin];

    case ADMIN.roles.editor:
      return [ADMIN.roles.admin, ADMIN.roles.editor];

    case ADMIN.roles.viewer:
      return [ADMIN.roles.admin, ADMIN.roles.editor, ADMIN.roles.viewer];

    default:
      return [];
  }
};

export const limitAccessTo = minAdminRole => (req, res, next) => {
  const allHigherRoles = higherAdminRoles(minAdminRole);

  if (!allHigherRoles.includes(req.admin.role)) {
    return next(new AppError("Sorry, you're not able to perform this action!", 403));
  }

  next();
};
