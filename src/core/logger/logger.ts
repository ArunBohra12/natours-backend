import { addColors, transports, createLogger, format } from 'winston';

import env from '@core/environment/environment';
import { LOG_FILE_PATH, WINSTON_COLORS } from './loggerConfig';

const { timestamp, json, colorize, combine } = format;

const winstonTransports = [];
const winstonFileFormatter = format.combine(timestamp(), json());

// This will add specified colors for logs based on log levels
addColors(WINSTON_COLORS);

const consoleTransport = new transports.Console({
  format: combine(timestamp(), json(), colorize({ all: true })),
});

// Ignore any kind of logs to console on production
if (env.NODE_ENV === 'development') {
  winstonTransports.push(consoleTransport);
}

// Write logs to *.log files only if enabled
if (env.ENABLE_LOGS === 'enable') {
  const fileTransport = new transports.File({
    filename: LOG_FILE_PATH,
    format: winstonFileFormatter,
    level: 'warn',
  });

  fileTransport.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('Error occurred in file transport:', error);

    // If file transport fails, fall back to console logging.
    winstonTransports.push(consoleTransport);
  });

  winstonTransports.push(fileTransport);
}

const logger = createLogger({
  transports: [...winstonTransports],
  rejectionHandlers: [
    new transports.File({
      filename: 'rejections.log',
      format: winstonFileFormatter,
    }),
  ],
  exitOnError: false,
});

export default logger;
