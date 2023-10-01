/* eslint-disable import/prefer-default-export */
import AppError from '../error/appError.js';
import CryptoHelper from '../helpers/cryptoHelper.js';
import EmailHelper from '../helpers/emailHelper.js';
import logger from '../logger/logger.js';
import User from '../models/userModel.js';

export const emailAddressVerification = async userEmail => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const cryptoHelper = new CryptoHelper();

    const otpToStore = cryptoHelper.encrypt(otp);
    const otpExpiry = new Date();
    // make otp valid for half hour (30 minutes) only
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 30);

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        verificationData: {
          otp: otpToStore,
          expiresAt: otpExpiry,
        },
      }
    ).select('+isVerified');

    if (!user) {
      throw new AppError('User does not exist', 404);
    }

    if (user.isVerified === true) {
      throw new AppError('User already verified', 204);
    }

    const email = new EmailHelper();
    await email.setEmailData({
      to: userEmail,
      subject: 'Verify email address',
      templateName: 'verifyEmail.ejs',
      templateData: {
        name: user.name,
        otp,
      },
    });

    await email.send();
  } catch (error) {
    logger.error('Error in sending verification email to user');
    logger.error(error);
    throw error;
  }
};
