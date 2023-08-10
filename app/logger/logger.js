import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import winston from 'winston';

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '.env'),
});

const LOGS_DIR_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', './logs');

const date = new Date()
  .toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })
  .replaceAll('/', '-');

winston.addColors({
  info: 'bold blue',
  warn: 'italic yellow',
  error: 'bold red',
});

const winstonTransports = [];

if (process.env.NODE_ENV !== 'production') {
  const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(info => `${info.level}: ${info.message}`)
    ),
  });

  winstonTransports.push(consoleTransport);
}

// Write logs to *.log files only if enabled or is production
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_LOGS === 'enable') {
  const winstonFileFormatter = winston.format.combine(
    winston.format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `${info.timestamp} :: ${info.level} : ${info.message}\n`),
    winston.format.json({
      space: 4,
    })
  );

  winstonTransports.push(
    new winston.transports.File({
      filename: `${LOGS_DIR_PATH}/${date}.error.log`,
      level: 'error',
      format: winstonFileFormatter,
    })
  );

  winstonTransports.push(
    new winston.transports.File({
      filename: `${LOGS_DIR_PATH}/${date}.combined.log`,
      format: winstonFileFormatter,
    })
  );
}

const logger = winston.createLogger({ transports: winstonTransports });

export default logger;
