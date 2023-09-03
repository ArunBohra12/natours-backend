import catchAsync from '../utils/catchAsync.js';
import User from '../models/userModel.js';
import AppError from '../error/appError.js';
import { uploadProfileImage } from '../utils/imageUpload.js';
import { filterObject } from '../utils/filters.js';

export const userSignup = catchAsync(async (req, res, next) => {
  const userData = filterObject(req.body, ['name', 'email', 'password']);

  const user = await User.create(userData);

  res.status(201).json({
    status: true,
    message: 'User created successfully',
    data: user,
  });
});

export const updateUserProfilePhoto = catchAsync(async (req, res, next) => {
  const { id: userId } = req.body;

  if (!req.file) {
    return next(new AppError('Please provide a valid image', 401));
  }

  const user = await User.findById(userId);
  const fileName = `${user.id}-${Date.now()}`;

  const data = await uploadProfileImage(req.file, fileName, next);

  if (!data[0]) {
    return next(data[1]);
  }

  const updatedPhoto = data[1][1].secure_url;

  user.photo = updatedPhoto;
  await user.save();

  res.status(200).json({
    status: true,
    message: 'Successfully updated profile photo.',
    data: {
      photo: updatedPhoto,
    },
  });
});
