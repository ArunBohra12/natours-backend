class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;

    // false for all the error message
    this.status = false;

    // Tells if we have a server error or if the API failed
    this.type = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';

    // This property tells that the error generated is expected beforehand
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
