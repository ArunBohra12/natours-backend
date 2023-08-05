/* eslint-disable import/prefer-default-export */

import catchAsync from '../../utils/catchAsync.js';
import User from '../models/userModel.js';

export const userSignup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    status: 1,
    message: 'User created successfully',
    data: user,
  });
});
