import dotenv from 'dotenv';
import path from 'path';

interface ApiEnvironment extends NodeJS.ProcessEnv {
  NODE_ENV: 'development' | 'production';
  PORT: string;
}

/**
 * Catches issues in the environment variables
 * Performs checks only for variables crucial to run the application
 */
const sanitizeEnv = (config: ApiEnvironment) => {
  if (!['development', 'production'].includes(config.NODE_ENV)) {
    throw new Error('NODE_ENV is missing or invalid in config.env');
  }

  if (!config.PORT || isNaN(Number(config.PORT))) {
    throw new Error('PORT is missing or is invalid in config.env');
  }
};

/**
 * Function to get the ApiEnvironment
 * Sets the default values, in case they aren't present in the config.env file
 * @returns ApiEnvironment
 */
const getConfig = (): ApiEnvironment => {
  dotenv.config({
    path: path.resolve(__dirname, '../../../config/config.env'),
  });

  const config: ApiEnvironment = {
    NODE_ENV:
      (process.env.NODE_ENV as 'development' | 'production') || 'development',
    PORT: process.env.PORT || '8000',
  };

  sanitizeEnv(config);

  return config;
};

const env: ApiEnvironment = getConfig();

export default env;
