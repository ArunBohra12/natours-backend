import path from 'node:path';

export const logFileTimestamp = new Date().toISOString();

export const WINSTON_COLORS = {
  info: 'bold blue',
  warn: 'italic yellow',
  error: 'bold red',
} as const;

// Log files will be named as - 23-05-2023.log
const LOG_FILE_NAME = `${new Date()
  .toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
  .replaceAll('/', '-')}.log`;

export const LOG_FILE_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  './logs',
  LOG_FILE_NAME,
);
