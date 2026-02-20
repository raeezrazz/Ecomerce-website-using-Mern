import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ConflictError, UnauthorizedError, NotFoundError, ValidationError } from '../errors/conflictErrors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Determine status code based on error type
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ConflictError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ValidationError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = err.errors.map((e: any) => e.message).join(", ");
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large. Maximum size is 5MB per image.';
  } else if (err.code === 'LIMIT_FILE_COUNT') {
    statusCode = 400;
    message = 'Too many files. Maximum 10 images per upload.';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field. Use field name "files" for images.';
  } else if (err.message && err.message.includes('image')) {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry. This record already exists.';
  } else if (err.message) {
    message = err.message;
  }

  // Log the error
  console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development' && err.stack) {
    console.error(err.stack);
  }

  // Don't send error details in production for 500 errors
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
