import JwtHelper from '../helpers/jwtHelper.js';

const loginHandler = (userData, responseData, statusCode, res) => {
  console.log('🚀 ~ file: loginHandler.js:6 ~ loginHandler ~ logger:', userData);

  const jwt = new JwtHelper(process.env.JWT_SECRET_KEY);

  const token = jwt.generateToken(userData, '90d');

  return res.status(statusCode).json({
    ...responseData,
    token,
  });
};

export default loginHandler;
