/* eslint-disable no-console */
import mongoose from 'mongoose';

const connectDB = async url => {
  try {
    await mongoose.connect(url);
    console.log('Connected to the DB');
  } catch (error) {
    console.log('Unable to connect to the DB.');
    console.log(`URL: ${url}`);
  }
};

export default connectDB;
