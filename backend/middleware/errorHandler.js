import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);
  
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, please try again later'
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = Object.values(err.errors)
      .map(item => item.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.CONFLICT;
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = `No item found with id: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.message = 'Your token has expired. Please log in again.';
  }

  return res.status(customError.statusCode).json({ 
    success: false, 
    message: customError.message 
  });
};

export default errorHandlerMiddleware;