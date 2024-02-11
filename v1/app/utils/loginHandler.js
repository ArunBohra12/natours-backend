import JwtHelper from '../helpers/jwtHelper.js';

// eslint-disable-next-line arrow-body-style
const sendTokenToClient = (res, statusCode, responseData, token) => {
  return res.status(statusCode).json({
    ...responseData,
    token,
  });
};

export const loginHandler = (userData, responseData, statusCode, res) => {
  const jwt = new JwtHelper(process.env.JWT_SECRET_KEY);
  const token = jwt.generateToken(userData, process.env.JWT_EXPIRES_IN);
  sendTokenToClient(res, statusCode, responseData, token);
};

export const adminLoginHandler = (adminData, responseData, statusCode, res) => {
  const jwt = new JwtHelper(process.env.ADMIN_JWT_SECRET_KEY);
  const token = jwt.generateToken(adminData, process.env.ADMIN_JWT_EXPIRES_IN);
  sendTokenToClient(res, statusCode, responseData, token);
};
