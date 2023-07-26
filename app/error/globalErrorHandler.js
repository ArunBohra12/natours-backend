// Handles all errors in development
// Sends all info about the error
const handleDevelopmentErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: 0,
    type: err.type,
    message: err.message,
    stack: err.stack,
  });
};

// Handles errors in production
const handleProductionErrors = (err, res) => {
  if (err.isOperational === true) {
    res.status(err.statusCode).json({
      status: 0,
      type: err.type,
      message: err.message,
    });
  }
};

// Global Error Handler for express
// All the errors pass through this middleware
const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return handleDevelopmentErrors(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      return handleProductionErrors(err, res);
    }

    // Errors that are unknown or programming errors - don't leak details here
    return res.status(500).json({
      status: 0,
      type: 'error',
      message: 'Sorry, something went very wrong',
    });
  }
};

export default globalErrorHandler;
