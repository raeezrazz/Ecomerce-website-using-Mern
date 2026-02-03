"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.NotFoundError = exports.UnauthorizedError = exports.ConflictError = void 0;
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConflictError";
        this.statusCode = 409; // HTTP 409 Conflict
    }
}
exports.ConflictError = ConflictError;
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401; // HTTP 401 Unauthorized
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404; // HTTP 404 Not Found
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 400; // HTTP 400 Bad Request
    }
}
exports.ValidationError = ValidationError;
