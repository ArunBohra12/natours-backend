/* eslint-disable no-console */

/**
 * This script will create all the upload presets in cloudinary required in the application
 * Run this with node to create all the presets
 */

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import logger from '../app/logger/logger';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

class CloudinaryPresets {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async transformProfileImagePreset() {
    try {
      await cloudinary.api.create_upload_preset({
        name: 'natours_profile_photos',
        folder: 'profile_photos',
        transformation: [
          {
            width: 200,
            height: 200,
            crop: 'thumb',
            gravity: 'face',
          },
        ],
      });

      logger.info('Success: Transform Profile Image Preset');
    } catch (err) {
      logger.error('Error: Transform Profile Image Preset', err);
    }
  }

  // Run all the preset creating functions here
  create() {
    this.transformProfileImagePreset();
  }
}

// Init the code
new CloudinaryPresets().create();
