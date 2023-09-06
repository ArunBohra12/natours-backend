/* eslint-disable import/prefer-default-export */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import uploadImage from './cloudinary.js';
import AppError from '../error/appError.js';
import logger from '../logger/logger.js';
import { UPLOAD_PRESETS } from '../../config/constants.js';

export const uploadProfileImage = async (file, fileName) => {
  const { mimetype, buffer: fileBuffer, originalname } = file;

  if (!mimetype.startsWith('image/')) {
    return [false, new AppError('Please provide a valid image', 401)];
  }

  const tempFilePath = path.join(os.tmpdir(), originalname);
  const writeFileAsync = promisify(fs.writeFile);

  try {
    await writeFileAsync(tempFilePath, fileBuffer);

    const data = await uploadImage(tempFilePath, fileName, UPLOAD_PRESETS.profileImages);

    return [true, data];
  } catch (error) {
    return [false, new AppError('Unable upload image. Please try again.', 401)];
  } finally {
    // Always remove the temporary file, regardless of the outcome
    fs.unlink(tempFilePath, err => {
      // TODO: Need to send email for this error
      if (err) logger.error('Error deleting file: ', err);
    });
  }
};

export const uploadProfileImageFromUrl = async (imageUrl, fileName) => {
  try {
    const data = await uploadImage(imageUrl, fileName, UPLOAD_PRESETS.profileImages);

    return [1, data];
  } catch (error) {
    return [0, new AppError('Unable upload image. Please try again.', 401)];
  }
};
