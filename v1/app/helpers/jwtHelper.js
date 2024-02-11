import jwt from 'jsonwebtoken';

class JwtHelper {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  generateToken(payload, expiresIn) {
    try {
      return jwt.sign(payload, this.secretKey, { expiresIn });
    } catch (error) {
      throw new Error('Error generating JWT token');
    }
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  // decode token without the secret key
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }
}

export default JwtHelper;
