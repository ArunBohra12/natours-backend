/**
 * Wrap the async function with catchAsync to catch the errors inside the function
 * NOTE: Only to be used in middlewares where we've access to the next variable
 */

const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export default catchAsync;
