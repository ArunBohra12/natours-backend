/* eslint-disable import/prefer-default-export */
import AppError from '../error/appError.js';
import CryptoHelper from '../helpers/cryptoHelper.js';
import EmailHelper from '../helpers/emailHelper.js';
import logger from '../logger/logger.js';
import User from '../models/userModel.js';

const emailHelper = new EmailHelper();

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

    await emailHelper.setEmailData({
      to: userEmail,
      subject: 'Verify email address',
      templateName: 'verifyEmail.ejs',
      templateData: {
        name: user.name,
        otp,
      },
    });

    await emailHelper.send();
  } catch (error) {
    logger.error('Error in sending verification email to user');
    logger.error(error);
    throw error;
  }
};

export const sendAdminLoginLink = async (adminDetails, token) => {
  try {
    if (!adminDetails.email || !adminDetails.name) {
      logger.error('Admin details were not provided to send email');
      throw new AppError('Something went wrong. Unable to send login link.', 400);
    }

    await emailHelper.setEmailData({
      to: adminDetails.email,
      subject: 'Login to Natours - Admin',
      templateName: 'adminLoginLink.ejs',
      templateData: {
        name: adminDetails.name,
        magicLink: `${process.env.CLIENT_APP_BASE_URL}/admin/login/${token}`,
      },
    });

    await emailHelper.send();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      logger.error('Error in sending login link to admin');
      logger.error(error);
      throw new AppError('Something went wrong. Unable to send login link.', 500);
    }
  }
};
