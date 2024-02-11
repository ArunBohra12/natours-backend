/* eslint-disable import/prefer-default-export */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import uploadImage from './cloudinary.js';
import AppError from '../error/appError.js';
import logger from '../logger/logger.js';
import { UPLOAD_PRESETS } from '../../config/constants.js';
import EmailHelper from '../helpers/emailHelper.js';

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
      if (!err) return;

      const email = new EmailHelper();

      // Send an error email for notification
      (async () => {
        await email.sendErrorEmail('Error: uploading images', {
          type: 'Error',
          message: 'Non removable profile image',
          description: `Unable to remove the file from temp path after uploading to cloudinary, ${tempFilePath}`,
          component: {
            name: 'Image Upload',
            file: 'app/utils/imageUpload.js',
          },
          error: err,
        });
      })();

      logger.error(`Error deleting file: ${JSON.stringify(err)}`);
    });
  }
};

export const uploadProfileImageFromUrl = async (imageUrl, fileName) => {
  try {
    const data = await uploadImage(imageUrl, fileName, UPLOAD_PRESETS.profileImages);

    return [true, data];
  } catch (error) {
    return [false, new AppError('Unable upload image. Please try again.', 401)];
  }
};
