import dotenv from 'dotenv';
import path from 'path';

interface ApiEnvironment extends NodeJS.ProcessEnv {
  NODE_ENV: 'development' | 'production';
  PORT: string;
  ENABLE_LOGS: 'enable' | 'disable';
  SENDGRID_API_KEY: string;
  EMAIL_FROM: string;
  MAILTRAP_HOST: string;
  MAILTRAP_PORT: string;
  MAILTRAP_USERNAME: string;
  MAILTRAP_PASSWORD: string;
  DATABASE_HOST: string;
  DATABASE_NAME: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_PORT: string;
}

/**
 * Catches issues in the environment variables
 * Performs checks only for variables crucial to run the application
 */
const sanitizeEnv = (config: ApiEnvironment) => {
  if (!['development', 'production'].includes(config.NODE_ENV)) {
    throw new Error('NODE_ENV is missing or invalid in config.env');
  }

  if (!config.PORT || Number.isNaN(Number(config.PORT))) {
    throw new Error('PORT is missing or is invalid in config.env');
  }

  if (
    !config.DATABASE_HOST ||
    !config.DATABASE_NAME ||
    !config.DATABASE_PASSWORD ||
    !config.DATABASE_USER ||
    !config.DATABASE_PORT
  ) {
    throw new Error('Missing DB config in config.env');
  }

  if (Number.isNaN(Number(config.DATABASE_PORT))) {
    throw new Error('Invalid PORT for the database provided');
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
    ENABLE_LOGS: (process.env.ENABLE_LOGS as 'enable' | 'disable') || 'disable',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
    EMAIL_FROM: process.env.EMAIL_FROM || '',
    MAILTRAP_HOST: process.env.MAILTRAP_HOST || '',
    MAILTRAP_PORT: process.env.MAILTRAP_PORT || '',
    MAILTRAP_USERNAME: process.env.MAILTRAP_USERNAME || '',
    MAILTRAP_PASSWORD: process.env.MAILTRAP_PASSWORD || '',
    DATABASE_HOST: process.env.DATABASE_HOST || '',
    DATABASE_NAME: process.env.DATABASE_NAME || '',
    DATABASE_USER: process.env.DATABASE_USER || '',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
    DATABASE_PORT: process.env.DATABASE_PORT || '',
  };

  sanitizeEnv(config);

  return config;
};

const env: ApiEnvironment = getConfig();

export default env;
