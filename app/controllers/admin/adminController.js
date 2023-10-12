/* eslint-disable import/prefer-default-export */
import Admin from '../../models/adminModel.js';
import AppError from '../../error/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import { filterObject } from '../../utils/filters.js';
import { ADMIN_ROLES } from '../../../config/constants.js';

export const createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, role } = filterObject(req.body, ['name', 'email', 'role']);

  if (!name || !email) {
    return next(new AppError('Please provide all details', 401));
  }

  // If there is no role matching to input
  if (role && !ADMIN_ROLES.includes(role)) {
    return next(new AppError('Please select a correct role', 401));
  }

  const admin = await Admin.create({
    name,
    email,
    role,
  });

  // TODO: Send admin a verification msg

  res.status(200).json({
    status: true,
    message: 'Successfully created admin',
    data: {
      admin,
    },
  });
});
