/* eslint-disable no-console */
/**
 * This script will add/remove allowed origins for the server in the DB
 * Usage: addAllowedOrigins.js --[add/remove] [...urls here seperated by space]
 */

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import validator from 'validator';
import AllowedOrigins from '../app/controllers/allowedOriginsModel.js';
import connectDB from '../config/db.js';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const option = process.argv[2];

const addAllowedOrigin = async () => {
  const urls = process.argv.slice(3) || [];

  const filteredUrls = urls.filter(url => {
    const isValidUrl = validator.isURL(url);

    if (!isValidUrl) {
      console.log(`${url} : isn't a valid URL and will not be added!`);
      return false;
    }

    return true;
  });

  await AllowedOrigins.findOneAndUpdate(
    {},
    { $addToSet: { urls: filteredUrls } },
    { new: true, upsert: true }
  );

  console.log('Successfully added the URLs');
};

const removeAllowedOrigin = async () => {
  const urls = process.argv.slice(3) || [];

  await AllowedOrigins.findOneAndUpdate(
    {},
    {
      // We don't filter for non valid URLs
      // as if DB value is non-valid URL it will be removed anyways
      $pull: { urls: { $in: urls } },
    }
  );

  console.log('Successfully removed the URLs');
};

(async function () {
  await connectDB(process.env.DATABASE_URL);

  try {
    if (option === '--add') {
      return await addAllowedOrigin();
    }

    if (option === '--remove') {
      return await removeAllowedOrigin();
    }
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
})();
