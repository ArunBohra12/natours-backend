/* eslint-disable no-console */
import mongoose from 'mongoose';
import logger from '../app/logger/logger.js';

const connectDB = async url => {
  try {
    await mongoose.connect(url);
    logger.info('Connected to the DB');
  } catch (error) {
    logger.error(JSON.stringify(error));
    logger.error(`Unable to connect to the DB. URL: ${url}`);
  }
};

export default connectDB;
