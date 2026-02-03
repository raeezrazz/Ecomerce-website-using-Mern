"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    console.log(`📩 [${req.method}] ${req.originalUrl}`);
    console.log(`📍 Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
    }
    next();
};
exports.requestLogger = requestLogger;
