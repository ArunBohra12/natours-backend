import { ApiErrorInterface, ErrorCategory, ErrorType } from './error.types';

class ApiError extends Error implements ApiErrorInterface {
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

export default ApiError;
