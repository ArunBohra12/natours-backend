import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

export const ENV_FILE_PATH = path.resolve(path.dirname(__filename), '..', '..', '.env');

export const logFileTimestamp = new Date().toISOString();

export const WINSTON_COLORS = {
  info: 'bold blue',
  warn: 'italic yellow',
  error: 'bold red',
};

// Log files will be named as - 23-05-2023.log
const LOG_FILE_NAME = `${new Date()
  .toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' })
  .replaceAll('/', '-')}.log`;

export const LOG_FILE_PATH = path.resolve(path.dirname(__filename), '..', './logs', LOG_FILE_NAME);
