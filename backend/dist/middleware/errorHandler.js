"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../errors/AppError");
const conflictErrors_1 = require("../errors/conflictErrors");
const errorHandler = (err, req, res, next) => {
    // Determine status code based on error type
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof conflictErrors_1.ConflictError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof conflictErrors_1.UnauthorizedError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof conflictErrors_1.NotFoundError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof conflictErrors_1.ValidationError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err.name === 'ZodError') {
        statusCode = 400;
        message = err.errors.map((e) => e.message).join(", ");
    }
    else if (err.name === 'MongoServerError' && err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry. This record already exists.';
    }
    else if (err.message) {
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
exports.errorHandler = errorHandler;
