import { errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Route not found - ${req.originalUrl}`, null, 404);
};

export const errorHandler = (err, req, res, next) => {
  logger.error(`Error Middleware Caught: ${err.message} [Stack: ${err.stack}]`);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    message = `Invalid resource identifier: ${err.value}`;
    statusCode = 400;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    statusCode = 400;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value entered for ${field} field.`;
    statusCode = 400;
  }

  // Handle Multer Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File size exceeds 5MB limit.';
    statusCode = 400;
  }

  return errorResponse(res, message, err, statusCode);
};
