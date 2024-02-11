// Handles all errors in development

import EmailHelper from '../helpers/emailHelper.js';

// Sends all info about the error
const handleDevelopmentErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: false,
    type: err.type,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// Handles errors in production
const handleProductionErrors = (err, res) => {
  if (err.isOperational === true) {
    return res.status(err.statusCode).json({
      status: false,
      type: err.type,
      message: err.message,
    });
  }

  // Errors that are unknown or programming errors
  const email = new EmailHelper();

  // Send an error email for notification
  (async () => {
    await email.sendErrorEmail('Error: uploading images', {
      type: 'Error',
      message: err.message,
      description: err.message,
      component: {
        name: 'Global Error Handler',
        file: 'app/error/globalErrorHandler.js',
      },
      error: err,
    });
  })();

  // Don't leak details to the client side
  return res.status(500).json({
    status: false,
    type: 'error',
    message: 'Sorry, something went very wrong',
  });
};

// Global Error Handler for express
// All the errors pass through this middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || false;
  err.type = err.type || 'fail';

  if (process.env.NODE_ENV === 'development') {
    return handleDevelopmentErrors(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    return handleProductionErrors(err, res);
  }
};

export default globalErrorHandler;
