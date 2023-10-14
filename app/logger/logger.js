import dotenv from 'dotenv';
import winston from 'winston';
import { ENV_FILE_PATH, logFileTimestamp, LOG_FILE_PATH, WINSTON_COLORS } from './loggerConfig.js';

dotenv.config({ path: ENV_FILE_PATH });
winston.addColors(WINSTON_COLORS);

const winstonTransports = [];

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(info => `${info.level}: ${info.message}`)
  ),
});

// Ignore any kind of logs to console on production
if (process.env.NODE_ENV === 'development') {
  winstonTransports.push(consoleTransport);
}

// Write logs to *.log files only if enabled
if (process.env.ENABLE_LOGS === 'enable') {
  const winstonFileFormatter = winston.format.combine(
    winston.format.printf(info => `${logFileTimestamp} - ${info.level}: ${info.message}\n`)
  );

  winstonTransports.push(
    new winston.transports.File({
      filename: LOG_FILE_PATH,
      format: winstonFileFormatter,
    })
  );
}

const logger = winston.createLogger({ transports: [...winstonTransports] });

logger.error({ firstName: 'mohammad', lastName: 'alshraideh' });

export default logger;
