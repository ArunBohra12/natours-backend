import crypto from 'node:crypto';
import logger from '../logger/logger.js';

class CryptoHelper {
  constructor() {
    this.salt = Buffer.from(process.env.CRYPTO_SALT);
    this.secretKey = this._deriveSecretKey(process.env.CRYPTO_SECRET_KEY);
    this.algorithm = 'aes-256-cbc';
  }

  _deriveSecretKey(secretString) {
    // Parameters for PBKDF2
    const iterations = 10000;
    const keyLength = 32;

    return crypto.pbkdf2Sync(secretString, this.salt, iterations, keyLength, 'sha256');
  }

  encrypt(data) {
    try {
      if (!data) {
        throw new Error('No Data provided to encrypt');
      }

      const stringifiedData = JSON.stringify(data);

      // Generate a new random IV for each encryption
      const initializationVector = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, initializationVector);
      let encryptedData = cipher.update(stringifiedData, 'utf8', 'hex');
      encryptedData += cipher.final('hex');

      // Prepend IV to the encrypted data
      const result = initializationVector.toString('hex') + encryptedData;

      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  decrypt(data) {
    try {
      if (!data) {
        throw new Error('No data provided to decrypt');
      }

      // Extract the IV from the beginning of the encrypted data
      // This assumes the IV is 16 bytes (32 hexadecimal characters) long when encoded as a hex string
      const initializationVector = Buffer.from(data.slice(0, 32), 'hex');
      const encryptedData = data.slice(32); // Remove the IV from the data

      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.secretKey,
        initializationVector
      );

      let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
      decryptedData += decipher.final('utf8');

      return decryptedData;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export default CryptoHelper;
