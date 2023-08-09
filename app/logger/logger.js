import path from 'node:path';
import { fileURLToPath } from 'node:url';
import winston from 'winston';

const LOGS_DIR_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', './logs');

const date = new Date()
  .toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })
  .replaceAll('/', '-');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `${LOGS_DIR_PATH}/${date}.error.log`,
      level: 'error',
    }),
    new winston.transports.File({ filename: `${LOGS_DIR_PATH}/${date}.combined.log` }),
  ],
});

export default logger;
