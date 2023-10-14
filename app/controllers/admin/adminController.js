import { v4 as uuidv4 } from 'uuid';
import logger from '../../logger/logger.js';
import Admin from '../../models/adminModel.js';
import AppError from '../../error/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import JwtHelper from '../../helpers/jwtHelper.js';
import { ADMIN } from '../../../config/constants.js';
import { sendAdminLoginLink } from '../../utils/sendEmails.js';
import { adminLoginHandler } from '../../utils/loginHandler.js';
import { filterObject, filterUnwantedItems } from '../../utils/filters.js';

const generateAdminLoginToken = async adminId => {
  if (!adminId) {
    return {
      status: false,
      message: 'Not admin provided',
    };
  }

  try {
    const jwt = new JwtHelper(process.env.ADMIN_JWT_SECRET_KEY);

    const tokenClaim = uuidv4();

    const loginVerificationToken = jwt.generateToken(
      {
        adminId,
        tokenClaim,
      },
      process.env.ADMIN_AUTH_JWT_EXPIRES_IN
    );

    const admin = await Admin.findOne(adminId);

    const tokenExpiry = new Date();
    tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 30);

    if (!admin) {
      return {
        status: false,
        message: 'No admin found',
      };
    }

    await Admin.findByIdAndUpdate(adminId, {
      // "loginToken" will be later taken from jwt during login and verified from db
      loginToken: tokenClaim,
      loginTokenExpiry: tokenExpiry,
    });

    return {
      status: true,
      token: loginVerificationToken,
    };
  } catch (error) {
    logger.error('Unable to generate magic link for admin login');
    logger.error(JSON.stringify(error));

    return {
      status: false,
      message: error.message,
    };
  }
};

export const createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, role } = filterObject(req.body, ['name', 'email', 'role']);

  if (!name || !email) {
    return next(new AppError('Please provide all details', 401));
  }

  // If there is no role matching to input
  // Also check if the role is admin (that way anyone can add highest level admins)
  if (role && !ADMIN.roles.includes(role) && role !== ADMIN.highestLevelAdmin) {
    return next(new AppError('Please select a correct role', 401));
  }

  const admin = await Admin.create({
    name,
    email,
    role,
  });

  res.status(200).json({
    status: true,
    message: 'Successfully created admin',
    data: {
      admin: filterUnwantedItems(admin.toObject(), ['loginToken', 'loginTokenExpiry', 'role']),
    },
  });
});

export const generateAdminLoginLink = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide an email', 401));
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return next(new AppError('Incorrect email. Please try again.', 401));
  }

  const { status, token } = await generateAdminLoginToken(admin._id);

  if (status !== true || !token) {
    return next(new AppError('Sorry, something went wrong. Please try again.'));
  }

  await sendAdminLoginLink({ email: admin.email, name: admin.name }, token);

  res.status(200).json({
    status: true,
    message: 'Success. Please check your email for the login link',
  });
});

export const loginAdmin = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    logger.error('JWT token not present for magic link login');
    return next(new AppError('Invalid reqest', 400));
  }

  const jwt = new JwtHelper(process.env.ADMIN_JWT_SECRET_KEY);

  // TODO: Fix errors coming from jwt class
  const adminData = jwt.verifyToken(token);

  if (!adminData) {
    logger.error('Sorry, something went wrong. Please try again.');
    return next(new AppError('Invalid reqest', 400));
  }

  const admin = await Admin.findById(adminData.adminId).select('+loginToken +loginTokenExpiry');

  if (!admin) {
    return next(new AppError('Invalid login. Please try again.', 401));
  }

  const now = new Date().getTime();
  const expiryTime = admin.loginTokenExpiry?.getTime();

  if (now > expiryTime) {
    return next(new AppError('The login link has expired. Please generate a new one.', 410));
  }

  if (adminData.tokenClaim !== admin.loginToken) {
    return next(
      new AppError(
        'The login link has either expired or is not valid. Please generate a new one',
        401
      )
    );
  }

  // After verifying admin, remove auth credentials
  // so that using same token again becomes invalid
  admin.loginToken = null;
  admin.loginTokenExpiry = null;

  await admin.save();

  adminLoginHandler(
    filterObject(admin.toObject(), ['_id', 'email', 'photo']),
    {
      status: true,
      message: 'Login successful',
    },
    200,
    res
  );
});
