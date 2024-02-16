/**
 * Base type for the ApiError class
 */
export type ApiErrorInterface = {
  message: string;
  statusCode: number;
  errorType: ErrorType;
  errorCategory?: ErrorCategory;
  stack?: string;
  meta: unknown;
};

/**
 * Defines type of the Error
 */
export type ErrorType =
  | 'ValidationError'
  | 'NotFoundError'
  | 'AuthenticationError'
  | 'AuthorizationError'
  | 'DatabaseError'
  | 'InternalError'
  | 'ConfigurationError'
  | 'NetworkError'
  | 'FileSystemError';

/**
 * Defines category of the Error
 *
 * Operational - Errors caused by factors outside of application eg. network issues, database failures, invalid user input
 *
 * Functional - These errors are typically caused by bugs, incorrect assumptions, or logic errors in the application
 */
export type ErrorCategory = 'Operational' | 'Functional';

/**
 * Error response for the API
 */
export type ErrorResponse = {
  status: boolean;
  message: string;
};

export type ErrorResponseDev = ErrorResponse & {
  error: ApiErrorInterface;
  stack: string;
};
