import catchAsync from '../utils/catchAsync.js';
import User from '../models/userModel.js';
import AppError from '../error/appError.js';
import { uploadProfileImage, uploadProfileImageFromUrl } from '../utils/imageUpload.js';
import { filterObject, filterUnwantedItems } from '../utils/filters.js';
import { emailAddressVerification } from '../utils/sendEmails.js';
import logger from '../logger/logger.js';
import { loginHandler } from '../utils/loginHandler.js';

export const userSignup = catchAsync(async (req, res, next) => {
  const userData = filterObject(req.body, ['name', 'email', 'password']);

  // Need to check this as password isn't a required field
  // due to google auth being available
  if (!userData.password) {
    return next(new AppError('Please provide a password', 401));
  }

  const user = await User.create(userData);

  // Using another try/catch here
  // to not send errors produced by emailAddressVerification to userSignup request
  try {
    await emailAddressVerification(userData.email);
  } catch (error) {
    logger.error(JSON.stringify(error));
  }

  return loginHandler(
    filterUnwantedItems(user.toObject(), ['role', 'password', 'isActive', 'isVerified', '__v']),
    {
      status: true,
      message: 'User created successfully',
      data: user,
    },
    201,
    res
  );
});

export const googleUserSignup = async (googleUserData, googleUserTokens) => {
  const { googleName: name, googleEmail: email, googleSub, googlePicture } = googleUserData;
  const { refreshToken } = googleUserTokens;

  const imageUploadData = await uploadProfileImageFromUrl(
    googlePicture,
    `${googleSub}-${Date.now()}`
  );

  if (imageUploadData[0] === 0) {
    throw imageUploadData[1];
  }

  const user = await User.create({
    name,
    email,
    photo: imageUploadData[1][1].secure_url,
    googleAccount: {
      googleId: googleSub,
      refreshToken,
    },
  });

  // Remove sensitive/unwanted data
  user.__v = undefined;
  user.password = undefined;
  user.googleAccount.refreshToken = undefined;
  user.isActive = undefined;

  return user;
};

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
