/* eslint-disable no-console */
/**
 * This script will add allowed origins for the server in the DB
 * Usage: addAllowedOrigins.js [...urls here seperated by space]
 */

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import validator from 'validator';
import AllowedOrigins from '../app/controllers/allowedOriginsModel.js';
import connectDB from '../config/db.js';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const urls = process.argv.slice(2) || [];

const filteredUrls = urls.filter(url => {
  const isValidUrl = validator.isURL(url);

  if (!isValidUrl) {
    console.log(`${url} : isn't a valid URL and will not be added!`);
    return false;
  }

  return true;
});

(async function () {
  await connectDB(process.env.DATABASE_URL);

  try {
    await AllowedOrigins.findOneAndUpdate(
      {},
      { $addToSet: { urls: filteredUrls } },
      { new: true, upsert: true }
    );

    console.log('Successfully added the URLs');
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
})();
