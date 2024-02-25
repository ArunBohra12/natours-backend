import logger from '@core/logger/logger';
import { ApiErrorInterface, ErrorCategory, ErrorType } from './error.types';

export class ApiError extends Error implements ApiErrorInterface {
  public meta: unknown;

  constructor(
    public message: string,
    public statusCode: number,
    public errorType: ErrorType,
    public errorCategory?: ErrorCategory,
  ) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    if (!errorCategory) {
      this.errorCategory = 'Operational';
    }
  }

  /**
   * Allows to attach additional data to the error for context
   * @param data Data to be added to the error
   */
  public addErrorMetadata(data: unknown) {
    this.meta = data;
  }

  /**
   * Serealizes the error data
   */
  public serialize() {
    return JSON.stringify({
      message: this.message,
      errorType: this.errorType,
      errorCategory: this.errorCategory,
      meta: this.meta,
      stack: this.stack,
    });
  }

  /**
   * Creates another instance of ApiError and returns it
   * @param serializedError Serialized error object
   * @returns ApiError instance
   */
  static deserializeError(serializedError: string): ApiError {
    const {
      message,
      statusCode,
      errorType,
      errorCategory,
      stack,
      meta,
    }: ApiError = JSON.parse(serializedError) || {};

    const error = new ApiError(message, statusCode, errorType, errorCategory);
    error.stack = stack;

    error.addErrorMetadata(meta);

    return error;
  }
}

/**
 * Internal server errors are handled here
 * Logs the error as well
 */
export const internalError = (
  message: string,
  type: ErrorCategory = 'Operational',
  metadata?: unknown,
) => {
  const err = new ApiError(message, 500, 'InternalError', type);

  if (metadata) {
    err.addErrorMetadata(metadata);
  }

  logger.error(err.serialize());

  return err;
};

/**
 * Error handling for validation errors
 */
export const validationError = (message: string, metadata?: unknown) => {
  const err = new ApiError(message, 400, 'ValidationError', 'Operational');

  if (metadata) {
    err.addErrorMetadata(metadata);
  }

  return err;
};

/**
 * Error for resource not found
 */
export const notFoundError = (message: string, metadata?: unknown) => {
  const err = new ApiError(message, 404, 'NotFoundError', 'Operational');

  if (metadata) {
    err.addErrorMetadata(metadata);
  }

  return err;
};

/**
 * Errors that happen during the auth process.
 */
export const authenticationError = (message: string, metadata?: unknown) => {
  const err = new ApiError(message, 401, 'AuthenticationError', 'Operational');

  if (metadata) {
    err.addErrorMetadata(metadata);
  }

  return err;
};

/**
 * Errors that happen during the auth process.
 */
export const authorizationError = (message: string, metadata?: unknown) => {
  const err = new ApiError(message, 403, 'AuthorizationError', 'Operational');

  if (metadata) {
    err.addErrorMetadata(metadata);
  }

  return err;
};

/**
 * All errors that occur or are related to the databse operations
 */
export const databaseError = (message: string, metadata?: unknown) => {
  const err = new ApiError(message, 404, 'DatabaseError', 'Operational');

  if (metadata) {
    err.addErrorMetadata(metadata);
  }

  logger.error(err.serialize());

  return err;
};

/**
 * Errors that occur when dealing with file stystem
 */
export const fileSystemError = (message: string, metadata?: unknown) => {
  const err = new ApiError(message, 500, 'FileSystemError', 'Operational');

  if (metadata) {
    err.addErrorMetadata(metadata);
  }

  return err;
};

/**
 * General error message for the user
 */
export const generalError = (metadata?: unknown) => {
  const err = new ApiError(
    'Sorry something went wrong. Please try again.',
    500,
    'InternalError',
    'Operational',
  );

  if (metadata) {
    err.addErrorMetadata(metadata);
  }

  return err;
};
